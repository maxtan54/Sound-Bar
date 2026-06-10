import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// POSTGRES_URL points at Supabase's transaction-mode pooler (port 6543),
// which does not support prepared statements.
const createClient = () =>
  postgres(process.env.POSTGRES_URL!, { prepare: false });

const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof createClient>;
};

const client = globalForDb.pgClient ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
