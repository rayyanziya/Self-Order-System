/*
  Warnings:

  - You are about to drop the column `category` on the `DailyCounter` table. All the data in the column will be lost.
  - You are about to drop the column `drinkNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `foodNumber` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyCounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_DailyCounter" ("counter", "date", "id") SELECT "counter", "date", "id" FROM "DailyCounter";
DROP TABLE "DailyCounter";
ALTER TABLE "new_DailyCounter" RENAME TO "DailyCounter";
CREATE UNIQUE INDEX "DailyCounter_date_key" ON "DailyCounter"("date");
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING_PAYMENT',
    "totalAmount" REAL NOT NULL,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("createdAt", "id", "paidAt", "status", "totalAmount", "updatedAt") SELECT "createdAt", "id", "paidAt", "status", "totalAmount", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
