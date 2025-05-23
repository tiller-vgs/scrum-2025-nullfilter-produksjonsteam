-- AlterTable
ALTER TABLE "DailyContent" ADD COLUMN "offerImage" TEXT;
ALTER TABLE "DailyContent" ADD COLUMN "quoteImage" TEXT;

-- CreateTable
CREATE TABLE "Login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Login_username_key" ON "Login"("username");
