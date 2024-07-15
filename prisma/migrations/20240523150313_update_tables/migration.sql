-- CreateTable
CREATE TABLE "Room" (
    "roomId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '장바구니',
    "description" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MemberRoom" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "roomId" INTEGER NOT NULL,
    "authority" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ShoppingItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shopped" BOOLEAN NOT NULL DEFAULT false,
    "roomId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_link_key" ON "Room"("link");

-- CreateIndex
CREATE UNIQUE INDEX "MemberRoom_roomId_key" ON "MemberRoom"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingItem_roomId_key" ON "ShoppingItem"("roomId");
