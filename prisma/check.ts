import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const stores = await prisma.store.findMany();
  const departments = await prisma.department.findMany();
  const wines = await prisma.wine.findMany();
  const wineStores = await prisma.wineStore.findMany();
  const slots = await prisma.slot.findMany();

  console.log("=".repeat(50));
  console.log(`店舗: ${stores.length}件`);
  console.log(`業態: ${departments.length}件`);
  console.log(`ワイン: ${wines.length}件`);
  console.log(`WineStore: ${wineStores.length}件`);
  console.log(`Slot: ${slots.length}件`);
  console.log("=".repeat(50));

  // 詳細表示
  console.log("\n【店舗一覧】");
  stores.forEach((s) => console.log(`  ${s.code}: ${s.name} (${s.city})`));

  console.log("\n【業態一覧】");
  departments.forEach((d) => console.log(`  ${d.type}: ${d.name}`));

  console.log("\n【ワイン一覧（最初の5件）】");
  wines.slice(0, 5).forEach((w) => 
    console.log(`  ${w.name} (${w.category}) - ¥${w.price}`)
  );

  console.log("\n【Slot一覧（最初の5件）】");
  slots.slice(0, 5).forEach((s) => 
    console.log(`  ${s.slotCode}: ${s.label} (source=${s.source})`)
  );

  const users = await prisma.user.findMany({
    include: { store: true, department: true },
  });
  console.log(`\nUser: ${users.length}件`);
  users.forEach((u) => {
    const storeName = u.store?.name || "-";
    const deptName = u.department?.name || "-";
    console.log(`  ${u.email} (${u.role}) | ${storeName} | ${deptName}`);
  });

  const wine = await prisma.wine.findFirst({
    where: { name: "ペトリュス" },
  });
  console.log(wine);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });