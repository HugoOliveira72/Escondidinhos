const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');
const fs = require('fs');

// Garante que a pasta instance/ exista no disco
const instanceDir = path.join(__dirname, '..', 'instance');
if (!fs.existsSync(instanceDir)) {
  fs.mkdirSync(instanceDir, { recursive: true });
}

// Caminho absoluto para o banco SQLite
const dbPath = path.join(instanceDir, 'itens.db');

// Instancia o adaptador BetterSqlite3
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

// Passa o adaptador para o construtor do PrismaClient
const prisma = new PrismaClient({ adapter });

async function conectarBanco() {
  await prisma.$connect();
}

async function criarTabelas() {
  console.log('Banco de dados conectado via Prisma Better-SQLite3 Adapter.');
}

module.exports = { prisma, conectarBanco, criarTabelas };