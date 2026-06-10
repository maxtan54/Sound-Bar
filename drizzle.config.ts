import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Session-mode connection (port 5432) — DDL/migrations need it;
    // the transaction pooler on POSTGRES_URL can't run migrations reliably.
    url: process.env.POSTGRES_URL_NON_POOLING!,
  },
});
