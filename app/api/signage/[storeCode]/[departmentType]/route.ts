import { NextResponse } from "next/server";
import {
  fetchStoreWithDepartment,
  fetchStoreWines,
  fetchDailyListing,  // ← 追加
} from "@/lib/signage/fetchers";
import { selectCategory } from "@/lib/signage/selectors";
import { generateSlotContent } from "@/lib/signage/generators";
import { today } from "@/lib/signage/helpers";  // ← 追加

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeCode: string; departmentType: string }> }
) {
  const { storeCode, departmentType } = await params;

  // 【A】データ取得
  const result = await fetchStoreWithDepartment(storeCode, departmentType);
  if (!result) {
    return NextResponse.json(
      { error: "Store or Department not found" },
      { status: 404 }
    );
  }
  const { store, department, slots } = result;

  const wines = await fetchStoreWines(store.id);

  // 【A】今日のおすすめ産地を決定
  const todayPickSlot = slots.find((s) => s.slotCode === "today-pick");
  const category = todayPickSlot
    ? await selectCategory(todayPickSlot.id, storeCode)
    : "";

  // 【B】表示内容を生成
   const slotsWithContent = await Promise.all(
    slots.map(async (slot) => {
      const daily = await fetchDailyListing(slot.id, today());
      const dailyData = daily
        ? {
            category: daily.category,
            wineIds: daily.wineIds ? JSON.parse(daily.wineIds) : [],
            price: daily.price,
            isAuto: daily.isAuto,
          }
        : null;

      return generateSlotContent(slot, {
        store,
        department,
        wines,
        category,
        daily: dailyData,
      });
    })
  );

  // プロモーション文
  const promotion = getPromotion(department.type);

  return NextResponse.json({
    store,
    department,
    slots: slotsWithContent,
    promotion: { content: promotion },
  });
}

// ========================================
// プロモーション文
// ========================================
function getPromotion(departmentType: string): string {
  if (departmentType === "retail") {
    return "ワインご購入のお客様に、2F バー・ビストロで使える10%割引チケットをお渡しします。今日お見送りされたワインを、ぜひ2Fで味わってみませんか？";
  }
  return "1F 小売でワインをご購入のお客様は、お渡ししたチケットをご提示ください。料金から10%割引させていただきます。";
}