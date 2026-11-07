// Removes files from older versions of this project that were deleted on purpose (old Supabase code, old middleware).
// Extracting a new zip over an old folder does not delete them, and they would break the build.
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";

const stale = [
  { path: "src/lib/supabase" },
  { path: "src/app/auth" },
  { path: "src/app/[locale]/reset" },
  { path: "supabase/migrations", parent: "supabase" },
  { path: "src/middleware.ts", onlyIf: (text) => /supabase|refreshSession/i.test(text) },
  { path: "src/middleware.js", onlyIf: (text) => /supabase|refreshSession/i.test(text) },
];

let removed = 0;
for (const { path, parent, onlyIf } of stale) {
  if (!existsSync(path)) continue;
  if (onlyIf && !onlyIf(readFileSync(path, "utf8"))) continue;
  rmSync(parent ?? path, { recursive: true, force: true });
  console.log(`[clean] removed old file(s): ${parent ?? path}`);
  removed++;
}
if (removed && existsSync(".next") && statSync(".next").isDirectory()) { rmSync(".next", { recursive: true, force: true }); console.log("[clean] cleared the .next cache"); }
if (removed) console.log("[clean] If you see 'Module not found' for @supabase, run `npm install` once.");
