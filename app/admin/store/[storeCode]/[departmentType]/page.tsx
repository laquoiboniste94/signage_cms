"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, SlotWithDaily } from "@/lib/admin/types";
import { canEditTodayPick, canEditWineSelection,
          canViewWines,
        } from "@/lib/admin/permissions";
import TodayPickEditor from "./components/TodayPickEditor";
import WineSelector from "./components/WineSelector";
import WineViewer from "./components/WineViewer";
import "./detail.css";

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeCode = params.storeCode as string;
  const departmentType = params.departmentType as string;

  
  // 追加
type DailyResponse = {
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
  date: string;
  slots: SlotWithDaily[];
};

// ...

const [data, setData] = useState<DailyResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
  // 初期化関数（初回のみ実行）
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("signage_user");
  if (!stored) return null;
  return JSON.parse(stored);
});

useEffect(() => {
  // ログインしていない場合のリダイレクト
  if (user === null) {
    router.push("/admin/login");
  }
}, [user, router]);

  // データ取得
  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, storeCode, departmentType]);

  async function fetchData() {
    const res = await fetch(
      `/api/admin/daily?store=${storeCode}&department=${departmentType}`
    );
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  if (loading || !user || !data) {
    return <div className="detail-loading">Loading...</div>;
  }

  const canEditPick = canEditTodayPick(user, storeCode, departmentType);
  const canEditWine = canEditWineSelection(user, storeCode);
  const canView = canViewWines(user, storeCode);

  return (
    <div className="detail-container">
      <header className="detail-header">
        <h1>
          {data.store.name} {data.department.name}
        </h1>
        <div className="detail-actions">
          {canView && (
            <button onClick={() => router.push(`/admin/wines/${storeCode}`)}>
            ワイン在庫一覧
            </button>
          )}
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

      <main className="detail-main">
        {data.slots.map((slotData: SlotWithDaily) => {
          const { slot, daily, wines, candidates } = slotData;

          // 本日のおすすめ産地
          if (slot.slotCode === "today-pick") {
            return (
              <div key={slot.id} className="slot-card">
                <h2>{slot.label}</h2>
                <TodayPickEditor
                  slot={slot}
                  daily={daily}
                  storeCode={storeCode}
                  departmentType={departmentType}
                  canEdit={canEditPick}
                  onUpdate={fetchData}
                />
              </div>
            );
          }

          // 無料試飲 / グラスワイン / アペロ
          if (["free-tasting", "service-glass", "apero"].includes(slot.slotCode)) {
            return (
              <div key={slot.id} className="slot-card">
                <h2>{slot.label}</h2>
                {canEditWine ? (
                  <WineSelector
                    slot={slot}
                    daily={daily}
                    wines={wines}
                    candidates={candidates}
                    onUpdate={fetchData}
                  />
                ) : (
                  <WineViewer daily={daily} wines={wines} slot={slot} />
                )}
              </div>
            );
          }

          // 店舗PR・お得な情報
          if (["pr", "promotion"].includes(slot.slotCode)) {
            return (
              <div key={slot.id} className="slot-card">
                <h2>{slot.label}</h2>
                <p className="slot-static">
                  {slot.slotCode === "pr"
                    ? data.store.concept
                    : "（固定文）"}
                </p>
              </div>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
}