"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Wine } from "@/lib/admin/types";
import "./wines.css";

type WineStoreItem = {
  id: string;
  retailPrice: number;
  wine: Wine;
};

export default function WinesPage() {
  const params = useParams();
  const router = useRouter();
  const storeCode = params.storeCode as string;

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("signage_user");
    if (!stored) return null;
    return JSON.parse(stored);
  });

  const [store, setStore] = useState<any>(null);
  const [wines, setWines] = useState<WineStoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 権限チェック
  useEffect(() => {
    if (user === null) {
      router.push("/admin/login");
      return;
    }
    // 現場店長はアクセス不可
    if (user.role === "floor") {
      router.push(`/admin/store/${user.store?.code}/${user.department?.type}`);
      return;
    }
    // 支配人は自店のみ
    if (user.role === "manager" && user.store?.code !== storeCode) {
      router.push(`/admin/wines/${user.store?.code}`);
      return;
    }
  }, [user, storeCode, router]);

  // データ取得
  useEffect(() => {
    if (!user) return;
    fetch(`/api/admin/wines?store=${storeCode}`)
      .then((res) => res.json())
      .then((json) => {
        setStore(json.store);
        setWines(json.wines);
        setLoading(false);
      });
  }, [user, storeCode]);

  if (loading || !user || !store) {
    return <div className="wines-loading">Loading...</div>;
  }

  // カテゴリーごとにグループ化
  const grouped = wines.reduce((acc, item) => {
    const cat = item.wine.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, WineStoreItem[]>);

  return (
    <div className="wines-container">
      <header className="wines-header">
        <h1>{store.name} - ワイン在庫一覧</h1>
        <div className="wines-actions">
          <button onClick={() => router.push("/admin/dashboard")}>
            ダッシュボード
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("signage_user");
              router.push("/admin/login");
            }}
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="wines-main">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="category-section">
            <h2>{category}</h2>
            <ul className="wine-items">
              {items.map((item) => (
                <li key={item.id} className="wine-item">
                  <span className="wine-name">{item.wine.name}</span>
                  <span className="wine-type">{item.wine.type}</span>
                  <span className="wine-price">
                    ¥{item.retailPrice.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}