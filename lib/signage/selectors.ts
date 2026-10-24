import { fetchDailyListing } from "./fetchers";
import { pickRandom, STORE_CATEGORIES, today } from "./helpers";

// ========================================
// 今日のおすすめ産地を決定
//   - 過去ログがあればそれを使う
//   - なければランダムで選ぶ
// ========================================
export async function selectCategory(
  slotId: string,
  storeCode: string,
  date: string = today()
): Promise<string> {
  const daily = await fetchDailyListing(slotId, date);
  if (daily) {
    return daily.category  || "";
  }
  // 過去ログがなければランダム
  const categories = STORE_CATEGORIES[storeCode] || [];
  return pickRandom(categories) || "";
}