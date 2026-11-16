import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  engine: "classic",
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    // Caminho relativo ou absoluto para o arquivo do SQLite na pasta instance/
    url: `file:${path.join(process.cwd(), "instance", "itens.db")}`,
  },
});