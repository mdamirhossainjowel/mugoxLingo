import { neon } from "@neondatabase/serverless";

export type Row = Record<string, unknown>;
export type Runner = (text: string, params?: unknown[]) => Promise<Row[]>;

let override: Runner | null = null;
/** Tests inject an in-process Postgres here. */
export const setRunnerForTests = (r: Runner | null) => { override = r; };

export const databaseUrl = () => process.env.DATABASE_URL ?? "";
export const isDbConfigured = () => override !== null || /^postgres(ql)?:\/\//.test(databaseUrl());
export const isNeonHost = (url: string) => { try { return new URL(url).hostname.endsWith(".neon.tech"); } catch { return false; } };

let cached: { url: string; run: Runner } | null = null;

function create(url: string): Runner {
  if (isNeonHost(url)) {
    // Neon: HTTP driver. Each query is one stateless request, which suits Vercel's serverless functions
    // (no connection pool to exhaust). Atomic work lives in one SQL function call, so no interactive transaction is needed.
    const sql = neon(url);
    return async (text, params = []) => (await sql.query(text, params as unknown[])) as Row[];
  }
  // Any other Postgres (local, Docker, self-hosted): regular TCP driver, loaded only when needed.
  let pool: import("pg").Pool | null = null;
  return async (text, params = []) => {
    if (!pool) { const { Pool } = await import("pg"); pool = new Pool({ connectionString: url, max: 3 }); }
    return (await pool.query(text, params as unknown[])).rows as Row[];
  };
}

/** Runs one parameterized query. Dates are cast to text in SQL so every driver returns the same shapes. */
export async function query<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  if (override) return (await override(text, params)) as T[];
  const url = databaseUrl();
  if (!/^postgres(ql)?:\/\//.test(url)) throw new Error("db_not_configured");
  if (!cached || cached.url !== url) cached = { url, run: create(url) };
  return (await cached.run(text, params)) as T[];
}
