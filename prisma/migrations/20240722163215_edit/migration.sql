-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT '귀여운 햄스터',
    "password" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT '기억에 남는 추억의 장소는?',
    "answer" TEXT NOT NULL DEFAULT '파주'
);
INSERT INTO "new_User" ("email", "id", "nickname", "password") SELECT "email", "id", "nickname", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
