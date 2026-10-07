"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MOCK_DATA, WineListItem, Slot } from "@/lib/mock-data";
import { SignageResponse } from "@/lib/signage/types";
import "./signage.css";

export default function SignagePage() {
  const params = useParams();
  const storeCode = params.storeCode as string;
  const departmentType = params.departmentType as string;
  const key = `${storeCode}-${departmentType}`;
 // const data = MOCK_DATA[key];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState<SignageResponse | null>(null);

  useEffect(() => {
    fetch(`/api/signage/${storeCode}/${departmentType}`)
        .then(res => res.json())
        .then(data => setData(data));
  }, []);

  if (!data) {
    return (
      <div className="signage-container">
        <div className="signage-error">
          <p>データが見つかりません</p>
          <p>{key}</p>
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

         {currentSlot.slotCode === "wine-list" && "wines" in currentSlot && (
  <ul>

    {/* スライド3：ワインリスト */}
    {currentSlot.wines.map((w, i) => (
      <li key={i}>
        <span className="wine-name">{w.name}</span>
        <span className="wine-price">
          ¥{w.bottlePrice.toLocaleString()} / グラス¥{w.glassPrice.toLocaleString()}
        </span>
      </li>
    ))}
  </ul>
)}

          {/* スライド3-B：一押しワイン */}
          {currentSlot.slotCode === "pick-wine" && (
            <div className="slide-pick-wine">
              <h2>{currentSlot.label}</h2>
              <p className="pick-wine-name">{currentSlot.wine?.name}</p>
              <p className="pick-wine-category">{currentSlot.wine?.category}</p>
              <p className="pick-wine-price">
                ¥{currentSlot.wine?.price?.toLocaleString()}
              </p>
              <p className="pick-wine-desc">{currentSlot.wine?.description}</p>
            </div>
          )}

          {/* スライド4-A：無料試飲 / サービスグラス */}
          {currentSlot.slotCode === "free-tasting" && (
            <div className="slide-wine">
              <h2>{currentSlot.label}</h2>
              <p className="wine-name">{currentSlot.wine?.name}</p>
              <p className="wine-category">{currentSlot.wine?.category}</p>
              <p className="wine-desc">{currentSlot.wine?.description}</p>
            </div>
          )}

          {currentSlot.slotCode === "service-glass" && (
            <div className="slide-service">
              <h2>{currentSlot.label}</h2>
              <p className="service-name">{currentSlot.wine?.name}</p>
              <p className="service-category">{currentSlot.wine?.category}</p>
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
      {currentSlot.wines.map((w, i) => (
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