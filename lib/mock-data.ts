// ========================================
// 型定義
// ========================================
export type WineListItem = {
  name: string;
  bottlePrice: number;
  glassPrice: number;
  type: string;
};

export type WineDetail = {
  name: string;
  category: string;
  type: string;
  price?: number;
  description?: string;
  normalPrice?: number;
  servicePrice?: number;
};

export type Slot =
  | { slotCode: "pr"; label: string; type: "static"; content: string }
  | {
      slotCode: "today-pick";
      label: string;
      type: "category";
      category: string;
      message: string;
    }
  | { slotCode: "wine-list"; label: string; type: "wine-list"; wines: WineListItem[] }
  | { slotCode: "pick-wine"; label: string; type: "wine"; wine: WineDetail }
  | { slotCode: "free-tasting"; label: string; type: "wine"; wine: WineDetail }
  | {
      slotCode: "service-glass";
      label: string;
      type: "wine";
      wine: WineDetail;
    }
  | {
      slotCode: "apero";
      label: string;
      type: "apero";
      price: number;
      regularPrice: number;
      wines: { name: string }[];
    };

export type SignageData = {
  store: { code: string; name: string; concept: string };
  department: { type: string; name: string };
  slots: Slot[];
  promotion: { content: string };
};

// ========================================
// モックデータ（6業態）
// ========================================
export const MOCK_DATA: Record<string, SignageData> = {
  "kyoto-retail": {
    store: {
      code: "kyoto",
      name: "△△ワイン 京都店",
      concept: "1970年創業、フランス直輸入の老舗",
    },
    department: { type: "retail", name: "小売" },
    slots: [
      {
        slotCode: "pr",
        label: "店舗PR",
        type: "static",
        content: "1970年創業、フランス直輸入の老舗",
      },
      {
        slotCode: "today-pick",
        label: "本日のおすすめ産地",
        type: "category",
        category: "ロワール",
        message: "ロワールワイン全品ポイント2倍",
      },
      {
        slotCode: "pick-wine",
        label: "本日の一押しワイン",
        type: "wine",
        wine: {
          name: "サンセール",
          category: "ロワール",
          type: "白",
          price: 5000,
          description: "爽やかな酸味とミネラル感",
        },
      },
      {
        slotCode: "free-tasting",
        label: "本日の無料試飲",
        type: "wine",
        wine: {
          name: "リースリング",
          category: "アルザス",
          type: "白",
          description: "華やかな香りとフルーティーな味わい",
        },
      },
    ],
    promotion: {
      content:
        "ワインご購入のお客様に、2F バー・ビストロで使える10%割引チケットをお渡しします。今日お見送りされたワインを、ぜひ2Fで味わってみませんか？",
    },
  },

  "kyoto-bar": {
    store: {
      code: "kyoto",
      name: "△△ワイン 京都店",
      concept: "歴史ある一本を、グラスで",
    },
    department: { type: "bar", name: "バー" },
    slots: [
      {
        slotCode: "pr",
        label: "店舗PR",
        type: "static",
        content: "歴史ある一本を、グラスで",
      },
      {
        slotCode: "today-pick",
        label: "本日のおすすめ産地",
        type: "category",
        category: "ローヌ",
        message: "チーズサービス＆ポイント2倍",
      },
      {
        slotCode: "wine-list",
        label: "本日のグラスワイン",
        type: "wine-list",
        wines: [
          {
            name: "シャトーヌフ・デュ・パプ",
            bottlePrice: 12000,
            glassPrice: 1200,
            type: "赤",
          },
          {
            name: "コート・ロティ",
            bottlePrice: 10500,
            glassPrice: 1050,
            type: "赤",
          },
          {
            name: "クローズ・エルミタージュ",
            bottlePrice: 7500,
            glassPrice: 750,
            type: "赤",
          },
        ],
      },
      {
        slotCode: "service-glass",
        label: "本日のサービスグラスワイン",
        type: "wine",
        wine: {
          name: "ヴーヴ・クリコ",
          category: "シャンパーニュ",
          type: "泡",
          normalPrice: 1500,
          servicePrice: 1050,
        },
      },
    ],
    promotion: {
      content:
        "1F 小売でワインをご購入のお客様は、お渡ししたチケットをご提示ください。料金から10%割引させていただきます。",
    },
  },

  "kyoto-bistro": {
    store: {
      code: "kyoto",
      name: "△△ワイン 京都店",
      concept: "ワインと料理のマリアージュ",
    },
    department: { type: "bistro", name: "ビストロ" },
    slots: [
      {
        slotCode: "pr",
        label: "店舗PR",
        type: "static",
        content: "ワインと料理のマリアージュ",
      },
      {
        slotCode: "today-pick",
        label: "本日のおすすめ産地",
        type: "category",
        category: "ボルドー",
        message: "デザートサービス＆ポイント2倍",
      },
      {
        slotCode: "pick-wine",
        label: "本日の一押しワイン",
        type: "wine",
        wine: {
          name: "シャトー・カロン・セギュール",
          category: "ボルドー",
          type: "赤",
          price: 6000,
          description: "力強いタンニンと黒果実の香り",
        },
      },
      {
        slotCode: "apero",
        label: "本日のアペロ",
        type: "apero",
        price: 2500,
        regularPrice: 3950,
        wines: [
          { name: "サンセール" },
          { name: "プイィ・フュメ" },
          { name: "シノン" },
        ],
      },
    ],
    promotion: {
      content:
        "1F 小売でワインをご購入のお客様は、お渡ししたチケットをご提示ください。料金から10%割引させていただきます。",
    },
  },

  "umeda-retail": {
    store: {
      code: "umeda",
      name: "△△ワイン 梅田店",
      concept: "世界の銘醸を、ここに",
    },
    department: { type: "retail", name: "小売" },
    slots: [
      {
        slotCode: "pr",
        label: "店舗PR",
        type: "static",
        content: "世界の銘醸を、ここに",
      },
      {
        slotCode: "today-pick",
        label: "本日のおすすめ産地",
        type: "category",
        category: "高級ボルドー",
        message: "高級ボルドーワイン全品ポイント2倍",
      },
      {
        slotCode: "pick-wine",
        label: "本日の一押しワイン",
        type: "wine",
        wine: {
          name: "シャトー・マルゴー",
          category: "高級ボルドー",
          type: "赤",
          price: 80000,
          description: "荘厳でエレガントな味わい",
        },
      },
      {
        slotCode: "free-tasting",
        label: "本日の無料試飲",
        type: "wine",
        wine: {
          name: "リースリング（アウスレーゼ）",
          category: "その他",
          type: "白",
          description: "ドイツの最高級甘口",
        },
      },
    ],
    promotion: {
      content:
        "ワインご購入のお客様に、2F バー・ビストロで使える10%割引チケットをお渡しします。今日お見送りされたワインを、ぜひ2Fで味わってみませんか？",
    },
  },

  "umeda-bar": {
    store: {
      code: "umeda",
      name: "△△ワイン 梅田店",
      concept: "世界の銘醸を、グラスで",
    },
    department: { type: "bar", name: "バー" },
    slots: [
      {
        slotCode: "pr",
        label: "店舗PR",
        type: "static",
        content: "世界の銘醸を、グラスで",
      },
      {
        slotCode: "today-pick",
        label: "本日のおすすめ産地",
        type: "category",
        category: "高級ブルゴーニュ",
        message: "チーズサービス＆ポイント2倍",
      },
      {
        slotCode: "wine-list",
        label: "本日のグラスワイン",
        type: "wine-list",
        wines: [
          {
            name: "シャンベルタン",
            bottlePrice: 120000,
            glassPrice: 12000,
            type: "赤",
          },
          {
            name: "ボンヌ・マール",
            bottlePrice: 60000,
            glassPrice: 6000,
            type: "赤",
          },
          {
            name: "ドン・ペリニヨン",
            bottlePrice: 58500,
            glassPrice: 5850,
            type: "泡",
          },
        ],
      },
      {
        slotCode: "service-glass",
        label: "本日のサービスグラスワイン",
        type: "wine",
        wine: {
          name: "ドン・ペリニヨン",
          category: "高級シャンパーニュ",
          type: "泡",
          normalPrice: 5850,
          servicePrice: 4100,
        },
      },
    ],
    promotion: {
      content:
        "1F 小売でワインをご購入のお客様は、お渡ししたチケットをご提示ください。料金から10%割引させていただきます。",
    },
  },

  "umeda-bistro": {
    store: {
      code: "umeda",
      name: "△△ワイン 梅田店",
      concept: "世界の銘醸と料理のマリアージュ",
    },
    department: { type: "bistro", name: "ビストロ" },
    slots: [
      {
        slotCode: "pr",
        label: "店舗PR",
        type: "static",
        content: "世界の銘醸と料理のマリアージュ",
      },
      {
        slotCode: "today-pick",
        label: "本日のおすすめ産地",
        type: "category",
        category: "イタリア",
        message: "デザートサービス＆ポイント2倍",
      },
      {
        slotCode: "pick-wine",
        label: "本日の一押しワイン",
        type: "wine",
        wine: {
          name: "バローロ",
          category: "イタリア",
          type: "赤",
          price: 12000,
          description: "タンニンと酸のバランスが秀逸",
        },
      },
      {
        slotCode: "apero",
        label: "本日のアペロ",
        type: "apero",
        price: 6250,
        regularPrice: 9720,
        wines: [
          { name: "シャトーヌフ・デュ・パプ" },
          { name: "コート・ロティ" },
          { name: "クローズ・エルミタージュ" },
        ],
      },
    ],
    promotion: {
      content:
        "1F 小売でワインをご購入のお客様は、お渡ししたチケットをご提示ください。料金から10%割引させていただきます。",
    },
  },
};