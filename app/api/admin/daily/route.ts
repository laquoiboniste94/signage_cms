import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { today } from "@/lib/signage/helpers";

// ソート順
const SLOT_ORDER = [
  "pr",
  "today-pick",
  "wine-list",
  "pick-wine",
  "free-tasting",
  "service-glass",
  "apero",
  "promotion",
];

// ========================================
// GET：日次データ取得
// ========================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeCode = searchParams.get("store");
  const departmentType = searchParams.get("department");
  const date = searchParams.get("date") || today();

  if (!storeCode || !departmentType) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({ where: { code: storeCode } });
  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const department = await prisma.department.findFirst({
    where: { storeId: store.id, type: departmentType },
    include: { slots: true },
  });
  if (!department) {
    return NextResponse.json({ error: "Department not found" }, { status: 404 });
  }

  const slotsWithDaily = await Promise.all(
  department.slots.map(async (slot) => {
    const daily = await prisma.dailyListing.findFirst({
      where: { slotId: slot.id, date },
    });

    // 選択済み
    let selectedWines: any[] = [];
    if (daily?.wineIds) {
      const ids = JSON.parse(daily.wineIds);
      const wineStores = await prisma.wineStore.findMany({
        where: { storeId: store.id, wineId: { in: ids } },
        include: { wine: true },
      });
      selectedWines = wineStores.map((ws) => ws.wine);
    }

    // 候補（requires に合う全ワイン）
    const wineStores = await prisma.wineStore.findMany({
      where: { storeId: store.id },
      include: { wine: { include: { capabilities: true } } },
    });
    let candidates = wineStores.map((ws) => ws.wine);

    if (slot.requires) {
      candidates = candidates.filter(
        (w) => w.capabilities && (w.capabilities as any)[slot.requires!]
      );
    }

    // 産地ごとにグループ化
    const candidatesByCategory: Record<string, any[]> = {};
    candidates.forEach((w) => {
      if (!candidatesByCategory[w.category]) {
        candidatesByCategory[w.category] = [];
      }
      candidatesByCategory[w.category].push(w);
    });

    return {
      slot: {
          id: slot.id,
          slotCode: slot.slotCode,
          label: slot.label,
          source: slot.source,
          count: slot.count,
          requires: slot.requires,
        },
        daily: daily
          ? {
              category: daily.category,
              wineIds: daily.wineIds ? JSON.parse(daily.wineIds) : [],
              price: daily.price,
              isAuto: daily.isAuto,
            }
          : null,
      wines: selectedWines,
      candidates: candidatesByCategory,  // ← グループ化
    };
  })
);

  // ソート
  const sortedSlots = slotsWithDaily.sort((a, b) => {
    const ai = SLOT_ORDER.indexOf(a.slot.slotCode);
    const bi = SLOT_ORDER.indexOf(b.slot.slotCode);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return NextResponse.json({
    store,
    department,
    date,
    slots: sortedSlots,
  });
}

// ========================================
// POST：日次データ更新
// ========================================
export async function POST(request: Request) {
  const { slotId, date, category, wineIds, isAuto, price } = await request.json();

  if (!slotId || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  let finalWineIds = wineIds;
  if (isAuto) {
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { department: true },
    });
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const wineStores = await prisma.wineStore.findMany({
      where: { storeId: slot.department.storeId },
      include: { wine: { include: { capabilities: true } } },
    });
    let candidates = wineStores.map((ws) => ws.wine);

    if (slot.requires) {
      candidates = candidates.filter(
        (w) => w.capabilities && (w.capabilities as any)[slot.requires!]
      );
    }

    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    finalWineIds = shuffled.slice(0, slot.count).map((w) => w.id);
  }

  const wineIdsJson = finalWineIds && finalWineIds.length > 0
  ? JSON.stringify(finalWineIds)
  : null;

const result = await prisma.dailyListing.upsert({
  where: { slotId_date: { slotId, date } },
  create: {
    slotId,
    date,
    category: category || null,
    wineIds: wineIdsJson,
    price: price || null,
    isAuto: isAuto || false,
  },
  update: {
    category: category || null,
    wineIds: wineIdsJson,
    price: price || null,
    isAuto: isAuto || false,
  },
});

  return NextResponse.json({ daily: result });
}