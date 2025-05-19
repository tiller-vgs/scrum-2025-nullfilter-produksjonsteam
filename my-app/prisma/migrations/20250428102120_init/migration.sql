-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "promotion" TEXT
);

-- CreateTable
CREATE TABLE "OpeningHours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" TEXT NOT NULL,
    "hours" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHours_day_key" ON "OpeningHours"("day");
