# MugoX Lingo (mugox-language)
Independent from the existing MugoX site. Phases 1-5: guest learning, accounts (Neon Postgres), SEO, tests.

    npm install
    npm run dev        # http://localhost:3000 -> /en (also /bn)
    npm run typecheck
    npm test
    npm run build

Requires Node 20+. Put your Neon connection string in .env.local as DATABASE_URL (see .env.example). `npm run dev` applies the database migrations automatically.

Key places: src/content (typed courses), src/features/exercises (engine + renderers),
src/features/gamification/rules.ts (XP/streak/hearts rules), src/features/progress/guest.ts (local progress).

See SETUP.md (Neon database and accounts) and DEPLOY.md (Vercel preview, domain migration).
Scripts: `npm run lint`, `npm test`, `npm run e2e`.

See LANGUAGES.md (adding interface languages) and SEO_ANALYTICS.md (SEO, Google Analytics, avoiding clashes with other MugoX sites).

## Updating from an older zip
Best: extract the new zip into a NEW empty folder, copy your `.env.local` over, run `npm install`, then `npm run dev`.
If you extract over an old folder, files that were removed in the new version stay behind (for example the old Supabase code). `npm run dev` and `npm run build` now delete the known leftovers automatically (`scripts/clean-stale.mjs`), but a fresh folder is cleaner.

AdSense, Google Analytics and the cookie banner are described in SEO_ANALYTICS.md. Translations of every screen live in src/i18n; course titles come from src/i18n/catalog.ts.
