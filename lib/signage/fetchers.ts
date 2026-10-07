import { prisma } from "@/lib/prisma";

// ========================================
// 店舗・業態・表示枠を取得
// ========================================
export async function fetchStoreWithDepartment(
  storeCode: string,
  departmentType: string
) {
  const store = await prisma.store.findUnique({
    where: { code: storeCode },
  });
  if (!store) return null;

  const department = await prisma.department.findFirst({
    where: { storeId: store.id, type: departmentType },
    include: { slots: true },
  });
  if (!department) return null;

  return { store, department, slots: department.slots };
}

// ========================================
// その店の在庫ワイン詳細リストを取得
// ========================================
export async function fetchStoreWines(storeId: string) {
  const wineStores = await prisma.wineStore.findMany({
    where: { storeId },
    include: {
      wine: {
        include: { capabilities: true },
      },
    },
  });
  return wineStores.map((ws) => ws.wine);
}

// ========================================
// 過去ログ（DailyListing）を取得
// ========================================
export async function fetchDailyListing(slotId: string, date: string) {
  return await prisma.dailyListing.findFirst({
    where: { slotId, date },
  });
}