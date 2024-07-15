/*
  Warnings:

  - Made the column `roomId` on table `ShoppingItem` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShoppingItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shopped" BOOLEAN NOT NULL DEFAULT false,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "ShoppingItem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("roomId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShoppingItem" ("id", "name", "roomId", "shopped") SELECT "id", "name", "roomId", "shopped" FROM "ShoppingItem";
DROP TABLE "ShoppingItem";
ALTER TABLE "new_ShoppingItem" RENAME TO "ShoppingItem";
PRAGMA foreign_key_check("ShoppingItem");
PRAGMA foreign_keys=ON;
