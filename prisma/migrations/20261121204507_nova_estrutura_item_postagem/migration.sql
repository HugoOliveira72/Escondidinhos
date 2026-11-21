-- CreateTable
CREATE TABLE "itens" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cor" TEXT
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

-- CreateTable
CREATE TABLE "Usuario" (
    "idUser" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "contato" TEXT,
    "tipoUser" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Postagem_id_item_key" ON "Postagem"("id_item");
