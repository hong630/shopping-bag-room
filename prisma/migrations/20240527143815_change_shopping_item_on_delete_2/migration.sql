-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MemberRoom" (
    "email" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "authority" TEXT NOT NULL,

    PRIMARY KEY ("email", "roomId"),
    CONSTRAINT "MemberRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("roomId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MemberRoom_email_fkey" FOREIGN KEY ("email") REFERENCES "User" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MemberRoom" ("authority", "email", "roomId") SELECT "authority", "email", "roomId" FROM "MemberRoom";
DROP TABLE "MemberRoom";
ALTER TABLE "new_MemberRoom" RENAME TO "MemberRoom";
PRAGMA foreign_key_check("MemberRoom");
PRAGMA foreign_keys=ON;
