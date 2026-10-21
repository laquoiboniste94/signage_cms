export type User = {
  id: string;
  email: string;
  role: "admin" | "manager" | "floor";
  store: {
    id: string;
    code: string;
    name: string;
  } | null;
  department: {
    id: string;
    type: string;
    name: string;
  } | null;
};

export type SlotWithDaily = {
  slot: {
    id: string;
    slotCode: string;
    label: string;
    source: string;
    count: number;
    requires: string | null;
  };
  daily: {
    category: string | null;
    wineIds: string[];
    price: number | null;
    isAuto: boolean;
  } | null;
  wines: Wine[];
  candidates: Record<string, Wine[]>;  // ← 追加
};

export type Wine = {
  id: string;
  name: string;
  category: string;
  type: string;
  origin: string;
  price: number;
  description: string | null;
};

// 追加
export type SlotData = {
  id: string;
  slotCode: string;
  label: string;
  source: string;
  count: number;
  requires: string | null;
};

export type DailyData = {
  category: string | null;
  wineIds: string[];
  price: number | null;
  isAuto: boolean;
} | null;