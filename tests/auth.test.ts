import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { freshDb, newUser } from "./helpers/pg";
import { setRunnerForTests, isNeonHost, isDbConfigured } from "@/lib/db";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteOtherSessions, deleteSession, hashToken, userForToken } from "@/lib/auth/session";
import { attemptKey, clearAttempts, isBlocked, recordAttempt } from "@/lib/auth/rateLimit";
import { getExamBest, getServerProgress } from "@/features/progress/server";

let db: PGlite; let A: string; let B: string;
beforeAll(async () => { db = await freshDb(); A = await newUser(db, "a@example.com"); B = await newUser(db, "b@example.com"); });
afterAll(() => setRunnerForTests(null));

describe("passwords", () => {
  it("hashes with scrypt, verifies, and rejects wrong or malformed input", async () => {
    const h = await hashPassword("correct horse battery");
    expect(h).toMatch(/^scrypt\$32768\$8\$1\$/);
    expect(await verifyPassword("correct horse battery", h)).toBe(true);
    expect(await verifyPassword("correct horse batterY", h)).toBe(false);
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
    expect(await verifyPassword("x", "scrypt$99999999$8$1$AA$AA")).toBe(false); // cost far above the cap
    expect(await hashPassword("same")).not.toBe(await hashPassword("same")); // random salt
  }, 20_000);
  it("compares against a dummy hash without throwing for unknown emails", async () => {
    expect(await verifyPassword("anything", DUMMY_HASH)).toBe(false);
  }, 20_000);
});

describe("sessions", () => {
  it("stores only a hash of the token and resolves it back to the user", async () => {
    const { token } = await createSession(A);
    const stored = (await db.query("select token_hash from sessions where user_id = $1", [A])).rows.map((r) => (r as { token_hash: string }).token_hash);
    expect(stored).toContain(hashToken(token)); expect(stored).not.toContain(token);
    expect((await userForToken(token))?.email).toBe("a@example.com");
  });
  it("rejects unknown, expired and deleted tokens", async () => {
    expect(await userForToken("nope")).toBeNull(); expect(await userForToken("")).toBeNull();
    const { token } = await createSession(A);
    await db.query("update sessions set expires_at = now() - interval '1 minute' where token_hash = $1", [hashToken(token)]);
    expect(await userForToken(token)).toBeNull();
    const live = await createSession(A); await deleteSession(live.token);
    expect(await userForToken(live.token)).toBeNull();
  });
  it("signing out other devices keeps only the current session", async () => {
    const one = await createSession(B); const two = await createSession(B);
    await deleteOtherSessions(B, one.token);
    expect(await userForToken(one.token)).not.toBeNull(); expect(await userForToken(two.token)).toBeNull();
  });
});

describe("rate limiting", () => {
  it("blocks after the limit, per key, and clears on success", async () => {
    const key = attemptKey("email:victim@example.com"); const other = attemptKey("email:other@example.com");
    for (let i = 0; i < 3; i++) await recordAttempt("login", [key]);
    expect(await isBlocked("login", [{ key, max: 3 }])).toBe(true);
    expect(await isBlocked("login", [{ key: other, max: 3 }])).toBe(false);
    expect(await isBlocked("signup", [{ key, max: 3 }])).toBe(false);
    await clearAttempts("login", key);
    expect(await isBlocked("login", [{ key, max: 3 }])).toBe(false);
  });
  it("normalizes keys so case and spaces do not dodge the limit", () => {
    expect(attemptKey(" A@B.com ")).toBe(attemptKey("a@b.com"));
  });
});

describe("progress queries", () => {
  it("reads one user's progress and never another's", async () => {
    await db.query("select record_lesson_completion($1::uuid,'attempt-p-001','en-es','es-greetings-1',7,7,24,'2026-10-12'::date,1,array['first_lesson','perfect'])", [A]);
    const a = await getServerProgress(A); const b = await getServerProgress(B);
    expect(a.xp).toBe(24); expect(a.completed["es-greetings-1"]).toMatchObject({ bestCorrect: 7, bestTotal: 7 });
    expect(a.streak).toEqual({ count: 1, lastDay: "2026-10-12" });
    expect(a.badges.sort()).toEqual(["first_lesson", "perfect"]); expect(a.daily).toEqual({ day: "2026-10-12", xp: 24 });
    expect(b.xp).toBe(0); expect(b.completed).toEqual({});
  });
  it("summarizes exam attempts per unit", async () => {
    await db.query("select record_exam_attempt($1::uuid,'en-es','es-u1','seed-aaaa-0001',6,10,60,false,100)", [B]);
    await db.query("select record_exam_attempt($1::uuid,'en-es','es-u1','seed-aaaa-0002',9,10,90,true,100)", [B]);
    expect((await getExamBest(B))["es-u1"]).toEqual({ best: 90, attempts: 2, passed: true });
    expect(await getExamBest(A)).toEqual({});
  });
});

describe("database selection", () => {
  it("uses the Neon serverless driver only for neon.tech hosts", () => {
    expect(isNeonHost("postgresql://u:p@ep-x-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require")).toBe(true);
    expect(isNeonHost("postgresql://u:p@localhost:5432/app")).toBe(false);
    expect(isNeonHost("not a url")).toBe(false);
  });
  it("reports configured when a runner is injected", () => expect(isDbConfigured()).toBe(true));
});
