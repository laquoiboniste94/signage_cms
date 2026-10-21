import { PrismaClient } from "../app/generated/prisma/client";
import type { Store, Department } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { WINES } from "./seed-data";

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
// ユーザーデータ
// ========================================
const USERS = [
  // 本部
  { email: "admin", password: "admin", role: "admin" },
  
  // 京都店 支配人
  { email: "kyoto-manager", password: "kyoto-manager", role: "manager", storeCode: "kyoto" },
  
  // 京都店 現場店長（3フロア）
  { email: "kyoto-retail", password: "kyoto-retail", role: "floor", storeCode: "kyoto", departmentType: "retail" },
  { email: "kyoto-bar", password: "kyoto-bar", role: "floor", storeCode: "kyoto", departmentType: "bar" },
  { email: "kyoto-bistro", password: "kyoto-bistro", role: "floor", storeCode: "kyoto", departmentType: "bistro" },
  
  // 梅田店 支配人
  { email: "umeda-manager", password: "umeda-manager", role: "manager", storeCode: "umeda" },
  
  // 梅田店 現場店長（3フロア）
  { email: "umeda-retail", password: "umeda-retail", role: "floor", storeCode: "umeda", departmentType: "retail" },
  { email: "umeda-bar", password: "umeda-bar", role: "floor", storeCode: "umeda", departmentType: "bar" },
  { email: "umeda-bistro", password: "umeda-bistro", role: "floor", storeCode: "umeda", departmentType: "bistro" },
];



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
      description: w.description || null,
      grapeVarieties: w.grapeVarieties ? JSON.stringify(w.grapeVarieties) : null,
      aromas: w.aromas ? JSON.stringify(w.aromas) : null,
      tasteLevel: w.tasteLevel || null,
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

  // ⑤ ユーザー作成
for (const u of USERS) {
  const store = u.storeCode ? stores[u.storeCode] : null;
  const dept = u.departmentType && store
    ? departments[`${u.storeCode}-${u.departmentType}`]
    : null;

  await prisma.user.create({
    data: {
      email: u.email,
      password: u.password,
      role: u.role,
      storeId: store?.id,
      departmentId: dept?.id,
    },
  });
}
console.log(`${USERS.length}人のユーザー作成`);

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