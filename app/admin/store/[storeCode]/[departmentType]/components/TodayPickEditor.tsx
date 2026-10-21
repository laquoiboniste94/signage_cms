"use client";

import { useState } from "react";
import { SlotData, DailyData } from "@/lib/admin/types";

type Props = {
  slot: SlotData;
  daily: DailyData;
  storeCode: string;
  departmentType: string;
  canEdit: boolean;
  onUpdate: () => void;
};

const CATEGORIES: Record<string, string[]> = {
  kyoto: ["ボルドー", "ブルゴーニュ", "ローヌ", "シャンパーニュ", "ロワール", "アルザス"],
  umeda: ["高級ボルドー", "高級ブルゴーニュ", "高級シャンパーニュ", "イタリア", "アメリカ", "その他"],
};

export default function TodayPickEditor({
  slot,
  daily,
  storeCode,
  departmentType,
  canEdit,
  onUpdate,
}: Props) {
  const [category, setCategory] = useState(daily?.category || "");
  const [saving, setSaving] = useState(false);
  const categories = CATEGORIES[storeCode] || [];

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: slot.id,
        date: new Date().toISOString().split("T")[0],
        category,
      }),
    });
    setSaving(false);
    onUpdate();
  }

  if (!canEdit) {
    return (
      <p className="slot-value">
        {daily?.category || "選択されていません"}
      </p>
    );
  }

  return (
    <div className="editor">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">選択してください</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button onClick={handleSave} disabled={saving}>
        {saving ? "保存中..." : "保存"}
      </button>
    </div>
  );
}