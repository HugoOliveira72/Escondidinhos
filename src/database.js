const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

// Caminho absoluto para o banco SQLite na pasta instance/
const dbPath = path.join(__dirname, '..', 'instance', 'itens.db');

// Instancia o adaptador BetterSqlite3 apontando para o arquivo local
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