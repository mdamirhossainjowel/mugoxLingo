import { PGlite } from "@electric-sql/pglite";
import { setRunnerForTests } from "@/lib/db";
// @ts-expect-error plain .mjs helper without types
import { applyMigrations } from "../../scripts/migrate-core.mjs";

/** An in-process Postgres with the real migrations applied, wired in as the app's database. */
export async function freshDb() {
  const db = new PGlite();
  await applyMigrations({ exec: (sql: string) => db.exec(sql), query: async (sql: string) => (await db.query(sql)).rows, dir: "db/migrations" });
  setRunnerForTests(async (text, params) => (await db.query(text, params as unknown[])).rows as Record<string, unknown>[]);
  return db;
}
export const newUser = async (db: PGlite, email = "ana@example.com") =>
  ((await db.query<{ id: string }>("insert into users (email, password_hash) values ($1, 'x') returning id", [email])).rows[0].id);
