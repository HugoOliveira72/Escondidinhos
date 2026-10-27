// Configuração do Prisma CLI (migrations e geração do client).
// O Prisma CLI não lê o .env sozinho, por isso o dotenv é carregado aqui.
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
})
