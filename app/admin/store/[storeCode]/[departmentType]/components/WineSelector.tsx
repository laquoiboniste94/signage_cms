"use client";

import { useState, useEffect } from "react";
import { SlotData, DailyData, Wine } from "@/lib/admin/types";

type Props = {
  slot: SlotData;
  daily: DailyData;
  wines: Wine[];
  candidates: Record<string, Wine[]>;
  onUpdate: () => void;
};

export default function WineSelector({
  slot,
  daily,
  wines,
  candidates,
  onUpdate,
}: Props) {
  const [mode, setMode] = useState<"manual" | "auto">(
    daily?.isAuto ? "auto" : "manual"
  );
  const [selected, setSelected] = useState<string[]>(daily?.wineIds || []);
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(daily?.wineIds || []);
    setMode(daily?.isAuto ? "auto" : "manual");
  }, [daily]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: slot.id,
        date: new Date().toISOString().split("T")[0],
        wineIds: mode === "manual" ? selected : null,
        isAuto: mode === "auto",
      }),
    });
    setSaving(false);
    onUpdate();
  }

  async function handleClear() {
    if (!confirm("選択をクリアしますか？")) return;

    setSaving(true);
    await fetch("/api/admin/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: slot.id,
        date: new Date().toISOString().split("T")[0],
        wineIds: null,
        isAuto: false,
      }),
    });
    setSaving(false);
    setSelected([]);
    setCategory("");
    setMode("manual");
    onUpdate();
  }

  function toggleWine(wineId: string) {
    if (selected.includes(wineId)) {
      setSelected(selected.filter((id) => id !== wineId));
    } else {
      if (slot.count === 1) {
        setSelected([wineId]);
      } else if (selected.length < slot.count) {
        setSelected([...selected, wineId]);
      }
    }
  }

  return (
    <div className="wine-selector">
      <div className="mode-tabs">
        <button
          className={mode === "manual" ? "active" : ""}
          onClick={() => setMode("manual")}
        >
          手動で選ぶ
        </button>
        <button
          className={mode === "auto" ? "active" : ""}
          onClick={() => setMode("auto")}
        >
          お任せ
        </button>
      </div>

      {mode === "manual" && (
        <>
          <div className="category-select">
            <label>産地:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">選択してください</option>
              {Object.keys(candidates).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {category && candidates[category] ? (
            <ul className="wine-list">
              {candidates[category].map((w) => (
                <li key={w.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(w.id)}
                      onChange={() => toggleWine(w.id)}
                      disabled={
                        slot.count === 1 &&
                        selected.length >= 1 &&
                        !selected.includes(w.id)
                      }
                    />
                    {w.name}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            category === "" && (
              <p className="select-hint">
                ※産地を選ぶと候補が表示されます
              </p>
            )
          )}

          {selected.length > 0 && (
            <p className="selected-info">
              選択中: {selected.length} / {slot.count} 本
            </p>
          )}
        </>
      )}

      {mode === "auto" && (
        <p className="auto-message">
          システムがランダムで{slot.count}本選びます
        </p>
      )}

      <div className="action-buttons">
        <button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </button>
        <button
          onClick={handleClear}
          disabled={saving || (selected.length === 0 && !daily)}
          className="clear-button"
        >
          クリア
        </button>
      </div>
    </div>
  );
}