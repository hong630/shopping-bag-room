/*
  Warnings:

  - The primary key for the `MemberRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MemberRoom" (
    "email" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "authority" TEXT NOT NULL,

    PRIMARY KEY ("email", "roomId")
);
INSERT INTO "new_MemberRoom" ("authority", "email", "roomId") SELECT "authority", "email", "roomId" FROM "MemberRoom";
DROP TABLE "MemberRoom";
ALTER TABLE "new_MemberRoom" RENAME TO "MemberRoom";
PRAGMA foreign_key_check("MemberRoom");
PRAGMA foreign_keys=ON;
