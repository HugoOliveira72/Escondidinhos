/*
  Warnings:

  - The primary key for the `itens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `imagemUrl` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `itens` table. All the data in the column will be lost.
  - Added the required column `categoria` to the `itens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_item` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ItemImagem" (
    "id_imagem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "id_item" INTEGER NOT NULL,
    CONSTRAINT "ItemImagem_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "itens" ("id_item") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Postagem" (
    "id_postagem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_item" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'perdido',
    "descricao" TEXT,
    "data_publicacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_encontrado" DATETIME,
    "local" TEXT,
    CONSTRAINT "Postagem_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "itens" ("id_item") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itens" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cor" TEXT
);
INSERT INTO "new_itens" ("nome") SELECT "nome" FROM "itens";
DROP TABLE "itens";
ALTER TABLE "new_itens" RENAME TO "itens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Postagem_id_item_key" ON "Postagem"("id_item");
