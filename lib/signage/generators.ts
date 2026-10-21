import {
  pickRandom,
  pickRandomN,
  PRICE_MULTIPLIER,
  SMALL_PLATE_PRICE,
} from "./helpers";

import {
  WineWithCapability,
  SlotContext,
  SlotData,
} from "./types";

// ========================================
// 価格計算
// ========================================
function calcBottlePrice(retailPrice: number, departmentType: string): number {
  const multiplier = PRICE_MULTIPLIER[departmentType] || 1.0;
  return Math.round(retailPrice * multiplier);
}

// ========================================
// ワインを整形
// ========================================
function formatWine(wine: WineWithCapability, departmentType: string) {
  const bottlePrice = calcBottlePrice(wine.price, departmentType);
  return {
    name: wine.name,
    category: wine.category,
    type: wine.type,
    origin: wine.origin,
    price: bottlePrice,
    description: wine.description || "",
    grapeVarieties: wine.grapeVarieties ? JSON.parse(wine.grapeVarieties) : [],
    aromas: wine.aromas ? JSON.parse(wine.aromas) : [],
    tasteLevel: wine.tasteLevel || null,
  };
}

function formatWineListItem(wine: WineWithCapability, departmentType: string) {
  const bottlePrice = calcBottlePrice(wine.price, departmentType);
  const base = {
    name: wine.name,
    bottlePrice,
    type: wine.type,
    description: wine.description || "",
  };

  // 小売はグラス提供なし
  if (departmentType === "retail") {
    return base;
  }

  return {
    ...base,
    glassPrice: Math.round(bottlePrice / 10),
  };
}


function formatServiceGlass(wine: WineWithCapability, departmentType: string) {
  const bottlePrice = calcBottlePrice(wine.price, departmentType);
  const normalPrice = Math.round(bottlePrice / 10);
  const servicePrice = Math.round(normalPrice * 0.7);
  return {
    name: wine.name,
    category: wine.category,
    type: wine.type,
    origin: wine.origin,
    description: wine.description || "",
    grapeVarieties: wine.grapeVarieties ? JSON.parse(wine.grapeVarieties) : [],
    aromas: wine.aromas ? JSON.parse(wine.aromas) : [],
    tasteLevel: wine.tasteLevel || null,
    normalPrice,
    servicePrice,
  };
}

// ========================================
// 表示枠ごとの内容を生成
// ========================================
export function generateSlotContent(
  slot: SlotData,
  context: SlotContext
) {
  const { store, department, wines, category, daily } = context;

  switch (slot.slotCode) {
    // 店舗PR
    case "pr":
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "static",
        content: store.concept || "",
      };

    // 本日のおすすめ産地
    case "today-pick":
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "category",
        category,
        message: getMessage(department.type, category),
      };

    // 本日の一押しワイン
    case "pick-wine": {
      const categoryWines = wines.filter((w) => w.category === category);
      const wine = pickRandom(categoryWines);
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "wine",
        wine: wine ? formatWine(wine, department.type) : null,
      };
    }

    // 本日のワインリスト（グラスワイン）
    case "wine-list": {
      const categoryWines = wines.filter((w) => w.category === category);
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "wine-list",
        wines: categoryWines.map((w) => formatWineListItem(w, department.type)),
      };
    }

    // 本日の無料試飲
    case "free-tasting": {
      // DailyListing があれば、それを使う
      if (daily?.wineIds && daily.wineIds.length > 0) {
        const selected = wines.find((w) => daily.wineIds.includes(w.id));
        if (selected) {
          return {
            slotCode: slot.slotCode,
            label: slot.label,
            type: "wine",
            wine: formatWine(selected, department.type),
          };
        }
      }
      // 未設定 → ランダム
      const tastingWines = wines.filter((w) => w.capabilities?.tasting);
      const wine = pickRandom(tastingWines);
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "wine",
        wine: wine ? formatWine(wine, department.type) : null,
      };
    }

    // 本日のサービスグラスワイン
    case "service-glass": {
      // DailyListing があれば、それを使う
      if (daily?.wineIds && daily.wineIds.length > 0) {
        const selected = wines.find((w) => daily.wineIds.includes(w.id));
        if (selected) {
          return {
            slotCode: slot.slotCode,
            label: slot.label,
            type: "wine",
            wine: formatServiceGlass(selected, department.type),
          };
        }
      }
      // 未設定 → ランダム
      const glassWines = wines.filter((w) => w.capabilities?.glass);
      const wine = pickRandom(glassWines);
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "wine",
        wine: wine ? formatServiceGlass(wine, department.type) : null,
      };
    }

    // 本日のアペロ
    case "apero": {
      // DailyListing があれば、それを使う
      if (daily?.wineIds && daily.wineIds.length > 0) {
        const selected = wines.filter((w) => daily.wineIds.includes(w.id));
        if (selected.length > 0) {
          return {
            slotCode: slot.slotCode,
            label: slot.label,
            type: "apero",
            price: daily.price || calcAperoPrice(selected, store.code),
            regularPrice: calcRegularPrice(selected, store.code),
            wines: selected.map((w) => ({ name: w.name })),
          };
        }
      }
      // 未設定 → ランダム
      const pairingWines = wines.filter((w) => w.capabilities?.pairing);
      const aperoWines = pickRandomN(pairingWines, 3);
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "apero",
        price: calcAperoPrice(aperoWines, store.code),
        regularPrice: calcRegularPrice(aperoWines, store.code),
        wines: aperoWines.map((w) => ({ name: w.name })),
      };
    }

    default:
      return {
        slotCode: slot.slotCode,
        label: slot.label,
        type: "static",
        content: "",
      };
  }
}

// ========================================
// 業態ごとのメッセージ
// ========================================
function getMessage(departmentType: string, category: string): string {
  switch (departmentType) {
    case "retail":
      return `${category}ワイン全品ポイント2倍`;
    case "bar":
      return "チーズサービス＆ポイント2倍";
    case "bistro":
      return "デザートサービス＆ポイント2倍";
    default:
      return "";
  }
}

// ========================================
// アペロ価格計算
// ========================================
function calcAperoPrice(wines: WineWithCapability[], storeCode: string): number {
  const wineCost = wines.reduce((sum, w) => sum + w.price, 0);
  const totalGlasses = wines.length * 10;
  const costPerGlass = wineCost / totalGlasses;
  const wineCostPerPerson = costPerGlass * 3;
  const plateCost = (SMALL_PLATE_PRICE[storeCode] || 800) * 3;
  const totalCost = wineCostPerPerson + plateCost;
  const price = totalCost / 0.65;
  return Math.round(price / 250) * 250;
}

function calcRegularPrice(wines: WineWithCapability[], storeCode: string): number {
  const wineRegular = wines.reduce((sum, w) => sum + w.price, 0);
  const plateRegular = (SMALL_PLATE_PRICE[storeCode] || 800) * 3;
  return Math.round(wineRegular + plateRegular);
}