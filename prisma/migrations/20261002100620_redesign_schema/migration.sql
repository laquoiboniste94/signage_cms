/*
  Warnings:

  - You are about to drop the column `gift` on the `Capability` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `WineStore` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `WineStore` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retailPrice` to the `WineStore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyListing" ADD COLUMN "price" INTEGER;
ALTER TABLE "DailyListing" ADD COLUMN "wineIds" TEXT;

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Department_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "storeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Capability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wineId" TEXT NOT NULL,
    "glass" BOOLEAN NOT NULL DEFAULT false,
    "bottle" BOOLEAN NOT NULL DEFAULT true,
    "tasting" BOOLEAN NOT NULL DEFAULT false,
    "pairing" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Capability_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Capability" ("bottle", "glass", "id", "pairing", "tasting", "wineId") SELECT "bottle", "glass", "id", "pairing", "tasting", "wineId" FROM "Capability";
DROP TABLE "Capability";
ALTER TABLE "new_Capability" RENAME TO "Capability";
CREATE UNIQUE INDEX "Capability_wineId_key" ON "Capability"("wineId");
CREATE TABLE "new_Slot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departmentId" TEXT NOT NULL,
    "slotCode" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "requires" TEXT,
    "source" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "staticText" TEXT,
    CONSTRAINT "Slot_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Slot" ("id", "label", "requires", "slotCode") SELECT "id", "label", "requires", "slotCode" FROM "Slot";
DROP TABLE "Slot";
ALTER TABLE "new_Slot" RENAME TO "Slot";
CREATE UNIQUE INDEX "Slot_departmentId_slotCode_key" ON "Slot"("departmentId", "slotCode");
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "concept" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Store" ("city", "code", "concept", "createdAt", "id", "name", "updatedAt") SELECT "city", "code", "concept", "createdAt", "id", "name", "updatedAt" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_code_key" ON "Store"("code");
CREATE TABLE "new_WineStore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wineId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "retailPrice" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WineStore_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WineStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WineStore" ("createdAt", "id", "role", "storeId", "wineId") SELECT "createdAt", "id", "role", "storeId", "wineId" FROM "WineStore";
DROP TABLE "WineStore";
ALTER TABLE "new_WineStore" RENAME TO "WineStore";
CREATE UNIQUE INDEX "WineStore_wineId_storeId_key" ON "WineStore"("wineId", "storeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Department_storeId_type_key" ON "Department"("storeId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
