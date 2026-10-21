// ========================================
// Prisma から取得されるデータの型
// ========================================
export type WineWithCapability = {
  id: string;
  name: string;
  category: string;
  type: string;
  origin: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  grapeVarieties: string | null;
  aromas: string | null;
  tasteLevel: number | null;
  capabilities: {
    glass: boolean;
    bottle: boolean;
    tasting: boolean;
    pairing: boolean;
  } | null;
};

export type StoreData = {
  id: string;
  code: string;
  name: string;
  city: string;
  concept: string | null;
};

export type DepartmentData = {
  id: string;
  storeId: string;
  type: string;
  name: string;
};

export type SlotData = {
  id: string;
  departmentId: string;
  slotCode: string;
  label: string;
  requires: string | null;
  source: string;
  count: number;
  staticText: string | null;
};

export type SlotContext = {
  store: StoreData;
  department: DepartmentData;
  wines: WineWithCapability[];
  category: string;
  daily: {
    category: string | null;
    wineIds: string[];
    price: number | null;
    isAuto: boolean;
  } | null;
};

// ========================================
// API レスポンス用
// ========================================
export type WineResponse = {
  name: string;
  category: string;
  type: string;
  origin?: string;
  description?: string;
  grapeVarieties?: string[];
  aromas?: string[];
  tasteLevel?: number | null;
  price?: number;
  normalPrice?: number;
  servicePrice?: number;
};

export type WineListItemResponse = {
  name: string;
  bottlePrice: number;
  glassPrice?: number;
  type: string;
  description?: string;
};

export type SlotResponse =
  | { slotCode: "pr"; label: string; type: "static"; content: string }
  | { slotCode: "promotion"; label: string; type: "static"; content: string }
  | {
      slotCode: "today-pick";
      label: string;
      type: "category";
      category: string;
      message: string;
    }
  | {
      slotCode: "pick-wine";
      label: string;
      type: "wine";
      wine: WineResponse | null;
    }
  | {
      slotCode: "free-tasting";
      label: string;
      type: "wine";
      wine: WineResponse | null;
    }
  | {
      slotCode: "service-glass";
      label: string;
      type: "wine";
      wine: WineResponse | null;
    }
  | {
      slotCode: "wine-list";
      label: string;
      type: "wine-list";
      wines: WineListItemResponse[];
    }
  | {
      slotCode: "apero";
      label: string;
      type: "apero";
      price: number;
      regularPrice: number;
      wines: { name: string }[];
    };

export type SignageResponse = {
  store: {
    id: string;
    code: string;
    name: string;
    city: string;
    concept: string | null;
  };
  department: {
    id: string;
    storeId: string;
    type: string;
    name: string;
  };
  slots: SlotResponse[];
  promotion: { content: string };
};