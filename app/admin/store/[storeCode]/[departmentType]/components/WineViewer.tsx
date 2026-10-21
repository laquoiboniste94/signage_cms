import { SlotData, DailyData, Wine } from "@/lib/admin/types";

type Props = {
  daily: DailyData;
  wines: Wine[];
  slot: SlotData;
};

export default function WineViewer({ daily, wines, slot }: Props) {
  if (!daily?.wineIds || daily.wineIds.length === 0) {
    return <p className="slot-value">選択されていません</p>;
  }

  return (
    <ul className="wine-list-view">
      {wines.map((w) => (
        <li key={w.id}>{w.name}</li>
      ))}
    </ul>
  );
}