/*
  Warnings:

  - Added the required column `location` to the `BoardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "gameSystem" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BoardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BoardEntry" ("body", "createdAt", "date", "gameSystem", "id", "title", "updatedAt", "userId") SELECT "body", "createdAt", "date", "gameSystem", "id", "title", "updatedAt", "userId" FROM "BoardEntry";
DROP TABLE "BoardEntry";
ALTER TABLE "new_BoardEntry" RENAME TO "BoardEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
