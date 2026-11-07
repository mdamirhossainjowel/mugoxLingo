import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { freshDb, newUser } from "./helpers/pg";
import { setRunnerForTests } from "@/lib/db";
// @ts-expect-error plain .mjs helper without types
import { applyMigrations } from "../scripts/migrate-core.mjs";

let db: PGlite; let A: string; let B: string;
const record = (user: string, attempt: string, xp = 20, badges: string[] = ["first_lesson"]) => db.query<{ r: { duplicate: boolean } }>(
  "select record_lesson_completion($1::uuid,$2::text,'en-es','l1',5,7,$3::int,'2026-10-10'::date,1,$4::text[]) as r", [user, attempt, xp, badges]);

beforeAll(async () => { db = await freshDb(); A = await newUser(db, "a@example.com"); B = await newUser(db, "b@example.com"); });
afterAll(() => setRunnerForTests(null));

describe("schema", () => {
  it("applies migrations once and is idempotent", async () => {
    const again = await applyMigrations({ exec: (s: string) => db.exec(s), query: async (s: string) => (await db.query(s)).rows, dir: "db/migrations" });
    expect(again).toBe(0);
  });
  it("creates a streak row for every new user", async () => {
    const r = await db.query("select count(*)::int as n from user_streaks where user_id = $1", [A]);
    expect((r.rows[0] as { n: number }).n).toBe(1);
  });
  it("keeps emails unique and lowercase", async () => {
    await expect(newUser(db, "a@example.com")).rejects.toMatchObject({ code: "23505" });
    await expect(newUser(db, "Upper@Example.com")).rejects.toThrow();
  });
  it("accepts any plausible interface language code and rejects junk", async () => {
    for (const code of ["en", "bn", "zh", "ar", "pt-BR"]) await db.query("update users set interface_locale = $2 where id = $1", [A, code]);
    await expect(db.query("update users set interface_locale = 'bad locale!' where id = $1", [A])).rejects.toThrow();
  });
  it("deleting a user removes their data", async () => {
    const tmp = await newUser(db, "tmp@example.com"); await record(tmp, "attempt-tmp-1");
    await db.query("delete from users where id = $1", [tmp]);
    for (const t of ["user_streaks", "lesson_completions", "xp_ledger", "user_achievements", "user_lesson_progress"]) {
      expect(((await db.query(`select count(*)::int as n from ${t} where user_id = $1`, [tmp])).rows[0] as { n: number }).n, t).toBe(0);
    }
  });
});

describe("rewards", () => {
  it("awards a completion once, even if submitted twice", async () => {
    expect((await record(A, "attempt-0001")).rows[0].r.duplicate).toBe(false);
    expect((await record(A, "attempt-0001")).rows[0].r.duplicate).toBe(true);
    const p = await db.query("select xp_total from users where id = $1", [A]);
    expect((p.rows[0] as { xp_total: number }).xp_total).toBe(20);
  });
  it("handles simultaneous duplicate submissions", async () => {
    await Promise.all([record(B, "attempt-race1"), record(B, "attempt-race1"), record(B, "attempt-race1")]);
    expect(((await db.query("select xp_total from users where id = $1", [B])).rows[0] as { xp_total: number }).xp_total).toBe(20);
  });
  it("records an exam once per seed and grants the pass badge once", async () => {
    const exam = (seed: string, passed: boolean) => db.query<{ r: { duplicate: boolean; new_badge: boolean } }>(
      "select record_exam_attempt($1::uuid,'en-es','es-u1',$2::text,8,10,80,$3::boolean,300) as r", [A, seed, passed]);
    expect((await exam("seed-abcdef-1", false)).rows[0].r.new_badge).toBe(false);
    expect((await exam("seed-abcdef-2", true)).rows[0].r.new_badge).toBe(true);
    expect((await exam("seed-abcdef-2", true)).rows[0].r.duplicate).toBe(true);
    expect((await exam("seed-abcdef-3", true)).rows[0].r.new_badge).toBe(false);
    expect(((await db.query("select count(*)::int as n from exam_attempts where user_id = $1", [A])).rows[0] as { n: number }).n).toBe(3);
  });
});
