import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeCode = searchParams.get("store");

  if (!storeCode) {
    return NextResponse.json({ error: "Missing store" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({ where: { code: storeCode } });
  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const wineStores = await prisma.wineStore.findMany({
    where: { storeId: store.id },
    include: { wine: { include: { capabilities: true } } },
    orderBy: { wine: { category: "asc" } },
  });

  return NextResponse.json({
    store,
    wines: wineStores.map((ws) => ({
      id: ws.id,
      retailPrice: ws.retailPrice,
      wine: ws.wine,
    })),
  });
}