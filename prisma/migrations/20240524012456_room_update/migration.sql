/*
  Warnings:

  - You are about to drop the column `link` on the `Room` table. All the data in the column will be lost.
  - Added the required column `code` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "roomId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '장바구니',
    "description" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL
);
INSERT INTO "new_Room" ("description", "roomId", "title") SELECT "description", "roomId", "title" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_code_key" ON "Room"("code");
PRAGMA foreign_key_check("Room");
PRAGMA foreign_keys=ON;
