"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SignageResponse } from "@/lib/signage/types";
import "./signage.css";

export default function SignagePage() {
  const params = useParams();
  const storeCode = params.storeCode as string;
  const departmentType = params.departmentType as string;

  const [data, setData] = useState<SignageResponse | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // データ取得
  useEffect(() => {
    fetch(`/api/signage/${storeCode}/${departmentType}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [storeCode, departmentType]);

  // 8秒ごとにスライド切り替え
  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.slots.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [data]);

  if (!data) {
    return (
      <div className="signage-container">
        <div className="signage-error">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentSlot = data.slots[currentSlide];

  return (
    <div className="signage-container">
      {/* 上部エリア */}
      <div className="signage-main">
        <header className="signage-header">
          <h1>
            {data.store.name} {data.department.name}
          </h1>
        </header>

        <div className="signage-slide">
          {/* スライド1：店舗PR */}
          {currentSlot.slotCode === "pr" && (
            <div className="slide-pr">
              <p className="pr-text">{currentSlot.content}</p>
            </div>
          )}

          {/* スライド2：本日のおすすめ産地 */}
          {currentSlot.slotCode === "today-pick" && (
            <div className="slide-pick">
              <h2>{currentSlot.label}</h2>
              <p className="pick-category">{currentSlot.category}</p>
              <p className="pick-message">{currentSlot.message}</p>
            </div>
          )}

          {/* スライド3-A：ワインリスト */}
          {currentSlot.slotCode === "wine-list" && "wines" in currentSlot && (
  <div className="slide-wine-list">
    <h2>{currentSlot.label}</h2>
    <ul>
      {currentSlot.wines.map((w, i) => (
        <li key={i}>
          <div className="wine-item-header">
            <span className="wine-name">{w.name}</span>
            <span className="wine-price">
                ¥{w.bottlePrice.toLocaleString()}
                  {w.glassPrice !== undefined && (
        <> / グラス¥{w.glassPrice.toLocaleString()}</>
          )}
      </span>
          </div>
          {w.description && (
            <span className="wine-desc">{w.description}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

          {/* スライド3-B：一押しワイン */}
          {currentSlot.slotCode === "pick-wine" && (
  <div className="slide-wine-list">
    <h2>{currentSlot.label}</h2>
    <ul>
      {currentSlot.wines?.map((w: any, i: number) => (
        <li key={i}>
          <span className="wine-name">{w.name}</span>
          <span className="wine-desc">{w.description}</span>
        </li>
      ))}
    </ul>
  </div>
)}

          {/* スライド4-A：無料試飲 */}
         {currentSlot.slotCode === "free-tasting" && (
  <div className="slide-wine-detail">
    <h2>{currentSlot.label}</h2>
    <p className="wine-name">{currentSlot.wine?.name}</p>
    <p className="wine-meta">
      {currentSlot.wine?.origin} / {currentSlot.wine?.type}
      {currentSlot.wine?.grapeVarieties?.length > 0 && (
        <> / {currentSlot.wine.grapeVarieties.join("・")}</>
      )}
    </p>
    <p className="wine-desc">{currentSlot.wine?.description}</p>

    {currentSlot.wine?.aromas?.length > 0 && (
      <p className="wine-aromas">
        アロマ: {currentSlot.wine.aromas.join(" / ")}
      </p>
    )}

    {currentSlot.wine?.tasteLevel && (
      <TasteBar
        level={currentSlot.wine.tasteLevel}
        type={currentSlot.wine.type}
      />
    )}
  </div>
)}

          {/* スライド4-A：サービスグラス */}
          {currentSlot.slotCode === "service-glass" && (
  <div className="slide-wine-detail">
    <h2>{currentSlot.label}</h2>
    <p className="wine-name">{currentSlot.wine?.name}</p>
    <p className="wine-meta">
      {currentSlot.wine?.origin} / {currentSlot.wine?.type}
      {currentSlot.wine?.grapeVarieties?.length > 0 && (
        <> / {currentSlot.wine.grapeVarieties.join("・")}</>
      )}
    </p>
    <p className="wine-desc">{currentSlot.wine?.description}</p>

    {currentSlot.wine?.aromas?.length > 0 && (
      <p className="wine-aromas">
        アロマ: {currentSlot.wine.aromas.join(" / ")}
      </p>
    )}

    {currentSlot.wine?.tasteLevel && (
      <TasteBar
        level={currentSlot.wine.tasteLevel}
        type={currentSlot.wine.type}
      />
    )}

    <p className="service-price">
      <span className="normal">
        通常 ¥{currentSlot.wine?.normalPrice?.toLocaleString()}
      </span>
      <span className="service">
        本日 ¥{currentSlot.wine?.servicePrice?.toLocaleString()}
      </span>
    </p>
  </div>
)}

          {/* スライド4-B：アペロ */}
          {currentSlot.slotCode === "apero" && "wines" in currentSlot && (
  <div className="slide-apero">
    <h2>{currentSlot.label}</h2>
    <p className="apero-price">
      <span className="regular">
        通常 ¥{currentSlot.regularPrice.toLocaleString()}
      </span>
      <span className="special">
        本日 ¥{currentSlot.price.toLocaleString()}
      </span>
    </p>
    <p className="apero-desc">ワイン3杯 + 小皿3品</p>
    <ul className="apero-wines">
      {currentSlot.wines.map((w: any, i: number) => (
        <li key={i}>・{w.name}</li>
      ))}
    </ul>
  </div>
)}

        </div>
      </div>

      {/* 下部エリア */}
      <footer className="signage-footer">
        <p>{data.promotion.content}</p>
      </footer>
    </div>
  );
}

  // ========================================
// 味わいバー
// ========================================
function TasteBar({ level, type }: { level: number; type: string }) {
  const labelLeft = type === "赤" ? "上品" : "淡麗";
  const labelRight = type === "赤" ? "重厚" : "芳醇";

  return (
    <div className="taste-bar">
      <span className="taste-label">{labelLeft}</span>
      <div className="taste-track">
        <div
          className="taste-fill"
          style={{ width: `${(level / 5) * 100}%` }}
        />
      </div>
      <span className="taste-label">{labelRight}</span>
    </div>
  );
}