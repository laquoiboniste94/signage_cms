import { PrismaClient } from "../app/generated/prisma/client";
import type { Store, Department } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// ========================================
// 店舗データ
// ========================================
const STORES = [
  {
    code: "kyoto",
    name: "△△ワイン 京都店",
    city: "京都",
    concept: "1970年創業、フランス直輸入の老舗",
  },
  {
    code: "umeda",
    name: "△△ワイン 梅田店",
    city: "梅田",
    concept: "世界の銘醸を、ここに",
  },
];

// ========================================
// 業態データ
// ========================================
const DEPARTMENT_TYPES = ["retail", "bar", "bistro"] as const;

// ========================================
// ワインデータ（36本）
// ========================================
const WINES = [
  // ===== 京都店（フランス6産地） =====
  // ボルドー
  { name: "シャトー・ムートン・ロートシルト", category: "ボルドー", type: "赤", origin: "フランス", price: 8000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "シャトー・カロン・セギュール", category: "ボルドー", type: "赤", origin: "フランス", price: 6000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "シャトー・ランシュ・バージュ", category: "ボルドー", type: "赤", origin: "フランス", price: 4000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  // ブルゴーニュ
  { name: "ニュイ・サン・ジョルジュ", category: "ブルゴーニュ", type: "赤", origin: "フランス", price: 12000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "ボーヌ・プルミエ・クリュ", category: "ブルゴーニュ", type: "赤", origin: "フランス", price: 8000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "ブルゴーニュ・ルージュ", category: "ブルゴーニュ", type: "赤", origin: "フランス", price: 4000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  // ローヌ
  { name: "シャトーヌフ・デュ・パプ", category: "ローヌ", type: "赤", origin: "フランス", price: 8000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "コート・ロティ", category: "ローヌ", type: "赤", origin: "フランス", price: 7000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "クローズ・エルミタージュ", category: "ローヌ", type: "赤", origin: "フランス", price: 5000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  // シャンパーニュ
  { name: "モエ・エ・シャンドン", category: "シャンパーニュ", type: "泡", origin: "フランス", price: 6000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: false },
  { name: "ヴーヴ・クリコ", category: "シャンパーニュ", type: "泡", origin: "フランス", price: 8000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: false },
  { name: "ポル・ロジェ", category: "シャンパーニュ", type: "泡", origin: "フランス", price: 7000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: false },
  // ロワール
  { name: "サンセール", category: "ロワール", type: "白", origin: "フランス", price: 5000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "プイィ・フュメ", category: "ロワール", type: "白", origin: "フランス", price: 6000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "シノン", category: "ロワール", type: "赤", origin: "フランス", price: 4500, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  // アルザス
  { name: "リースリング", category: "アルザス", type: "白", origin: "フランス", price: 5000, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "ゲヴュルツトラミネール", category: "アルザス", type: "白", origin: "フランス", price: 5500, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "ピノ・グリ", category: "アルザス", type: "白", origin: "フランス", price: 4500, store: "kyoto", glass: true, bottle: true, tasting: true, pairing: true },

  // ===== 梅田店（高級+外国6カテゴリー） =====
  // 高級ボルドー
  { name: "ペトリュス", category: "高級ボルドー", type: "赤", origin: "フランス", price: 300000, store: "umeda", glass: false, bottle: true, tasting: false, pairing: false },
  { name: "シャトー・マルゴー", category: "高級ボルドー", type: "赤", origin: "フランス", price: 80000, store: "umeda", glass: false, bottle: true, tasting: true, pairing: false },
  { name: "シャトー・ランシュ・バージュ", category: "高級ボルドー", type: "赤", origin: "フランス", price: 35000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  // 高級ブルゴーニュ
  { name: "ロマネ・コンティ", category: "高級ブルゴーニュ", type: "赤", origin: "フランス", price: 1500000, store: "umeda", glass: false, bottle: true, tasting: false, pairing: false },
  { name: "シャンベルタン", category: "高級ブルゴーニュ", type: "赤", origin: "フランス", price: 80000, store: "umeda", glass: false, bottle: true, tasting: true, pairing: false },
  { name: "ボンヌ・マール", category: "高級ブルゴーニュ", type: "赤", origin: "フランス", price: 40000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  // 高級シャンパーニュ
  { name: "サロン", category: "高級シャンパーニュ", type: "泡", origin: "フランス", price: 150000, store: "umeda", glass: false, bottle: true, tasting: false, pairing: false },
  { name: "クリュッグ", category: "高級シャンパーニュ", type: "泡", origin: "フランス", price: 80000, store: "umeda", glass: false, bottle: true, tasting: true, pairing: false },
  { name: "ドン・ペリニヨン", category: "高級シャンパーニュ", type: "泡", origin: "フランス", price: 39000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  // イタリア
  { name: "バローロ", category: "イタリア", type: "赤", origin: "イタリア", price: 12000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "ブルネッロ・ディ・モンタルチーノ", category: "イタリア", type: "赤", origin: "イタリア", price: 15000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "アマローネ", category: "イタリア", type: "赤", origin: "イタリア", price: 10000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  // アメリカ
  { name: "オーパス・ワン", category: "アメリカ", type: "赤", origin: "アメリカ", price: 30000, store: "umeda", glass: false, bottle: true, tasting: true, pairing: false },
  { name: "ケイマス", category: "アメリカ", type: "赤", origin: "アメリカ", price: 15000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: false },
  { name: "ダックホーン", category: "アメリカ", type: "赤", origin: "アメリカ", price: 12000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: false },
  // その他
  { name: "ベガ・シシリア ウニコ", category: "その他", type: "赤", origin: "スペイン", price: 35000, store: "umeda", glass: false, bottle: true, tasting: true, pairing: false },
  { name: "リースリング（アウスレーゼ）", category: "その他", type: "白", origin: "ドイツ", price: 15000, store: "umeda", glass: true, bottle: true, tasting: true, pairing: true },
  { name: "ペンフォールズ グランジ", category: "その他", type: "赤", origin: "オーストラリア", price: 60000, store: "umeda", glass: false, bottle: true, tasting: true, pairing: false },
];

// ========================================
// Slot 定義
// ========================================
const SLOTS = {
  retail: [
    { slotCode: "pr", label: "店舗PR", source: "static" },
    { slotCode: "today-pick", label: "本日のおすすめ産地", source: "category" },
    { slotCode: "wine-list", label: "本日のワインリスト", source: "category" },
    { slotCode: "free-tasting", label: "本日の無料試飲", source: "all" },
    { slotCode: "promotion", label: "お得な情報", source: "static" },
  ],
  bar: [
    { slotCode: "pr", label: "店舗PR", source: "static" },
    { slotCode: "today-pick", label: "本日のおすすめ産地", source: "category" },
    { slotCode: "wine-list", label: "本日のワインリスト", source: "category" },
    { slotCode: "service-glass", label: "本日のサービスグラスワイン", source: "all" },
    { slotCode: "promotion", label: "お得な情報", source: "static" },
  ],
  bistro: [
    { slotCode: "pr", label: "店舗PR", source: "static" },
    { slotCode: "today-pick", label: "本日のおすすめ産地", source: "category" },
    { slotCode: "wine-list", label: "本日のワインリスト", source: "category" },
    { slotCode: "apero", label: "本日のアペロ", source: "all", count: 3 },
    { slotCode: "promotion", label: "お得な情報", source: "static" },
  ],
};



// ========================================
// メイン処理
// ========================================
async function main() {
  console.log("シード開始...");


  // クリア
  await prisma.dailyListing.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.wineStore.deleteMany();
  await prisma.capability.deleteMany();
  await prisma.wine.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.store.deleteMany();

  // ① 店舗作成
  const stores: Record<string, Store> = {};
  for (const s of STORES) {
    const store = await prisma.store.create({ data: s });
    stores[s.code] = store;
    console.log(`店舗作成: ${store.name}`);
  }

  // ② 業態作成
  const departments: Record<string, Department> = {};
  for (const [storeCode, store] of Object.entries(stores)) {
    for (const type of DEPARTMENT_TYPES) {
      const dept = await prisma.department.create({
        data: {
          storeId: store.id,
          type,
          name: type === "retail" ? "小売" : type === "bar" ? "バー" : "ビストロ",
        },
      });
      departments[`${storeCode}-${type}`] = dept;
    }
    console.log(`${store.name} の3業態作成`);
  }

  // ③ ワイン作成
  for (const w of WINES) {
    const store = stores[w.store];
    const wine = await prisma.wine.create({
      data: {
        name: w.name,
        category: w.category,
        type: w.type,
        origin: w.origin,
        price: w.price,
        capabilities: {
          create: {
            glass: w.glass,
            bottle: w.bottle,
            tasting: w.tasting,
            pairing: w.pairing,
          },
        },
      },
    });

    // WineStore（建物単位）
    await prisma.wineStore.create({
      data: {
        wineId: wine.id,
        storeId: store.id,
        retailPrice: w.price,
        role: "normal",
      },
    });
  }
  console.log(`${WINES.length}本のワイン作成`);

  type SlotDef = {
  slotCode: string;
  label: string;
  source: string;
  count?: number;
};

const SLOTS: Record<"retail" | "bar" | "bistro", SlotDef[]> = {
  retail: [
    { slotCode: "pr", label: "店舗PR", source: "static" },
    { slotCode: "today-pick", label: "本日のおすすめ産地", source: "category" },
    { slotCode: "wine-list", label: "本日のワインリスト", source: "category" },
    { slotCode: "free-tasting", label: "本日の無料試飲", source: "all" },
    { slotCode: "promotion", label: "お得な情報", source: "static" },
  ],
  bar: [
    { slotCode: "pr", label: "店舗PR", source: "static" },
    { slotCode: "today-pick", label: "本日のおすすめ産地", source: "category" },
    { slotCode: "wine-list", label: "本日のワインリスト", source: "category" },
    { slotCode: "service-glass", label: "本日のサービスグラスワイン", source: "all" },
    { slotCode: "promotion", label: "お得な情報", source: "static" },
  ],
  bistro: [
    { slotCode: "pr", label: "店舗PR", source: "static" },
    { slotCode: "today-pick", label: "本日のおすすめ産地", source: "category" },
    { slotCode: "wine-list", label: "本日のワインリスト", source: "category" },
    { slotCode: "apero", label: "本日のアペロ", source: "all", count: 3 },
    { slotCode: "promotion", label: "お得な情報", source: "static" },
  ],
};

  // ④ Slot作成
  for (const [key, dept] of Object.entries(departments)) {
    const type = key.split("-")[1] as keyof typeof SLOTS;
    const slots = SLOTS[type as keyof typeof SLOTS]; 
    for (const s of slots) {
      await prisma.slot.create({
        data: {
          departmentId: dept.id,
          slotCode: s.slotCode,
          label: s.label,
          source: s.source,
          count: s.count || 1,
        },
      });
    }
  }
  console.log("Slot作成完了");

  console.log("シード完了");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });