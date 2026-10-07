// ========================================
// ランダム関連
// ========================================
export function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ========================================
// 日付
// ========================================
export function today(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ========================================
// 定数
// ========================================
export const STORE_CATEGORIES: Record<string, string[]> = {
  kyoto: ["ボルドー", "ブルゴーニュ", "ローヌ", "シャンパーニュ", "ロワール", "アルザス"],
  umeda: ["高級ボルドー", "高級ブルゴーニュ", "高級シャンパーニュ", "イタリア", "アメリカ", "その他"],
};

export const SMALL_PLATE_PRICE: Record<string, number> = {
  kyoto: 800,
  umeda: 1200,
};

export const PRICE_MULTIPLIER: Record<string, number> = {
  retail: 1.0,
  bar: 1.5,
  bistro: 1.8,
};