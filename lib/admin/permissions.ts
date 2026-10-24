import { User } from "./types";

// 本日のおすすめ産地・一押しワインを編集できるか（現場店長）
export function canEditTodayPick(
  user: User,
  storeCode: string,
  departmentType: string
): boolean {
  return (
    user.role === "floor" &&
    user.store?.code === storeCode &&
    user.department?.type === departmentType
  );
}

// 無料試飲・グラスワイン・アペロを編集できるか（支配人）
export function canEditWineSelection(
  user: User,
  storeCode: string
): boolean {
  return (
    (user.role === "manager" || user.role === "admin") &&
    user.store?.code === storeCode
  );
}

// ========================================
// ワイン在庫一覧を閲覧できるか（本部 or その店舗の支配人）
// ========================================
export function canViewWines(
  user: User,
  storeCode: string
): boolean {
  // 本部は全店舗OK
  if (user.role === "admin") return true;

  // 支配人は自店舗のみ
  if (user.role === "manager" && user.store?.code === storeCode) {
    return true;
  }

  // 現場店長は不可
  return false;
}

// ========================================
// ページアクセス権限
// ========================================
export function canAccessStorePage(
  user: User,
  storeCode: string,
  departmentType: string
): boolean {
  // 本部は全ページOK
  if (user.role === "admin") return true;

  // 支配人は自店舗のみ
  if (user.role === "manager" && user.store?.code === storeCode) {
    return true;
  }

  // 現場店長は自分のフロアのみ
  if (
    user.role === "floor" &&
    user.store?.code === storeCode &&
    user.department?.type === departmentType
  ) {
    return true;
  }

  return false;
}