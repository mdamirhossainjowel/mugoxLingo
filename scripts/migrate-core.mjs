import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Applies every .sql file in `dir` that has not been applied yet, each inside its own transaction. */
export async function applyMigrations({ exec, query, dir, log = () => {} }) {
  await exec("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
  const done = new Set((await query("select name from schema_migrations")).map((r) => r.name));
  let applied = 0;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(file)) continue;
    const sql = readFileSync(join(dir, file), "utf8");
    await exec(`begin;\n${sql}\ninsert into schema_migrations (name) values ('${file.replace(/'/g, "''")}');\ncommit;`);
    log(`applied ${file}`); applied++;
  }
  return applied;
}
