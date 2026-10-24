"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/admin/types";
import { canAccessStorePage } from "@/lib/admin/permissions";
import "./dashboard.css";

const STORES = [
  { code: "kyoto", name: "△△ワイン 京都店" },
  { code: "umeda", name: "△△ワイン 梅田店" },
];

const DEPARTMENTS = [
  { type: "retail", name: "小売" },
  { type: "bar", name: "バー" },
  { type: "bistro", name: "ビストロ" },
];

export default function DashboardPage() {
  const router = useRouter();
 const [user, setUser] = useState<User | null>(() => {
  if (typeof window === "undefined") {
    console.log("【SERVER】 window なし → null");
    return null;
  }

  console.log("【CLIENT】 window あり");
  const stored = localStorage.getItem("signage_user");

  if (!stored) {
    console.log("【CLIENT】 LS 空 → 未ログイン");
    return null;
  }

  console.log("【CLIENT】 LS にログイン情報あり");
  return JSON.parse(stored);
});

  useEffect(() => {
  if (user === null) {
    router.push("/admin/login");  // 未ログイン
  } 
}, [user, router]);

  if (!user) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  function handleLogout() {
    localStorage.removeItem("signage_user");
    router.push("/admin/login");
  }

  // 権限に応じたリンクを生成
  const links = [];
  for (const store of STORES) {
    for (const dept of DEPARTMENTS) {
      if (canAccessStorePage(user, store.code, dept.type)) {
        links.push({
          storeCode: store.code,
          storeName: store.name,
          deptType: dept.type,
          deptName: dept.name,
        });
      }
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          {user.role === "admin" ? "本部" : user.store?.name || "ダッシュボード"}
        </h1>
        <button onClick={handleLogout}>ログアウト</button>
      </header>

      <main className="dashboard-main">
        <h2>フロア一覧</h2>
        {links.length === 0 ? (
          <p>アクセス可能なフロアがありません</p>
        ) : (
          <div className="link-list">
            {links.map((link, i) => (
              <button
                key={i}
                className="link-button"
                onClick={() =>
                  router.push(`/admin/store/${link.storeCode}/${link.deptType}`)
                }
              >
                {link.storeName} - {link.deptName}
              </button>
            ))}
          </div>
        )}

        {/* ワイン在庫一覧（本部・支配人のみ） */}
        {(user.role === "admin" || user.role === "manager") && (
          <>
            <h2>ワイン在庫一覧</h2>
            <div className="link-list">
              {STORES.filter(
                (s) => user.role === "admin" || user.store?.code === s.code
              ).map((store) => (
                <button
                  key={store.code}
                  className="link-button wine-button"
                  onClick={() => router.push(`/admin/wines/${store.code}`)}
                >
                  {store.name} - 在庫一覧
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}