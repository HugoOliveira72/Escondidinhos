-- CreateTable
CREATE TABLE "itens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "local" TEXT,
    "imagemUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'perdido',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
