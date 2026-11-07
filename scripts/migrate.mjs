// Applies db/migrations to the database in DATABASE_URL (from the environment, .env.local or .env).
// `--soft` never fails the command: used by predev/prestart so the app can still start.
import { existsSync, readFileSync } from "node:fs";
import { applyMigrations } from "./migrate-core.mjs";

const soft = process.argv.includes("--soft");
function fromEnvFiles() {
  for (const f of [".env.local", ".env"]) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(/^\s*DATABASE_URL\s*=\s*(.*)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
}
const url = process.env.DATABASE_URL || fromEnvFiles();
const done = (code, msg) => { if (msg) console[code ? "warn" : "log"](msg); process.exit(soft ? 0 : code); };
if (!/^postgres(ql)?:\/\//.test(url)) done(1, "[db] DATABASE_URL is not set. Add it to .env.local (see .env.example). Accounts stay off until then; guest learning still works.");

let client, close;
try {
  const { default: pg } = await import("pg");
  // Neon: run migrations over a direct (non-pooled) connection with full certificate checking.
  const isNeon = new URL(url).hostname.endsWith(".neon.tech");
  const connectionString = isNeon ? url.replace(/-pooler(?=\.)/, "").replace("sslmode=require", "sslmode=verify-full") : url;
  client = new pg.Client({ connectionString });
  await client.connect(); close = () => client.end();
  const n = await applyMigrations({
    exec: (sql) => client.query(sql), query: async (sql) => (await client.query(sql)).rows, dir: "db/migrations", log: (m) => console.log(`[db] ${m}`),
  });
  console.log(n ? `[db] ${n} migration(s) applied.` : "[db] up to date.");
  await close(); done(0);
} catch (e) {
  try { await close?.(); } catch {}
  done(1, `[db] Migration failed: ${e instanceof Error ? e.message : e}`);
}
