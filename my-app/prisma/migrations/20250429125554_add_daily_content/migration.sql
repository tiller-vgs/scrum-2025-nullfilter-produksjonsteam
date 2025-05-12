-- CreateTable
CREATE TABLE "DailyContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentOffer" TEXT,
    "currentQuote" TEXT,
    "offerHistory" TEXT NOT NULL DEFAULT '[]',
    "quoteHistory" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);
