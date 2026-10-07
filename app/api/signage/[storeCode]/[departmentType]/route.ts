import { NextResponse } from "next/server";
import {
  fetchStoreWithDepartment,
  fetchStoreWines,
} from "@/lib/signage/fetchers";
import { selectCategory } from "@/lib/signage/selectors";
import { generateSlotContent } from "@/lib/signage/generators";

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
  const slotsWithContent = slots.map((slot) =>
    generateSlotContent(slot, { store, department, wines, category })
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