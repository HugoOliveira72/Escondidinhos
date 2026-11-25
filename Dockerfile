FROM node:22-slim

# Ferramentas necessárias para módulos nativos (ex.: better-sqlite3) e SSL/OpenSSL
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia arquivos de dependências primeiro para aproveitar cache de build
COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Instala dependências e gera o Prisma Client
RUN npm ci
RUN npx prisma generate

# Copia o restante do código-fonte e arquivos estáticos
COPY . .

# Garante que a pasta instance exista
RUN mkdir -p /app/instance

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:/app/instance/itens.db"

EXPOSE 3000

# Aplica migrações pendentes (cria/atualiza o banco SQLite) e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]