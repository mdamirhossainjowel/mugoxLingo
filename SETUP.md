# Database and accounts (Neon Postgres)

Without a database the app still runs: guests can learn, and the account pages say accounts are not set up.

## Quick start (your .env.local is already filled in)
    npm install
    npm run dev          # first it applies db/migrations to your Neon database (predev), then starts the site

`npm run db:migrate` applies the migrations by hand. It is safe to repeat (applied files are tracked in `schema_migrations`), and it connects to Neon directly (not through the pooler).

## Where the database settings live
- `DATABASE_URL` in `.env.local` (copy `.env.example` for a fresh checkout). On Vercel add the same variable in Project Settings > Environment Variables.
- The connection string contains your password. Keep `.env.local` out of Git (it is already in `.gitignore`) and out of shared zips. If the string was ever pasted somewhere public or in a chat, reset the password in the Neon console (Roles > Reset password) and update `.env.local`.

## How the app talks to Neon
- Neon hosts use the `@neondatabase/serverless` HTTP driver: one stateless request per query, so serverless functions on Vercel never exhaust connections. All multi-step writes (XP, streak, badges, exam results) are single SQL function calls, which are atomic.
- Any other Postgres (local or Docker) works too: set `DATABASE_URL` to it and the regular `pg` driver is used.
- All data access is server-side, and every query is filtered by the signed-in user's id. There is no database access from the browser.

## Accounts
- Email and password, hashed with scrypt. Sessions are random tokens in an HttpOnly cookie; only a SHA-256 hash of the token is stored. Sessions last 30 days and are removed on sign-out. Changing the password signs out all other devices.
- Sign-in and sign-up are rate limited in the database (works across serverless instances).
- Not built yet: email verification, password reset by email, sign-in with Google. They need an email provider or a managed auth service. Neon Auth is the natural next step: run `neon init` and `neon deploy` on your computer after `neon login`.

## First-run checklist
- `npm run dev`, open `/en/signup`, create an account: you land on your account page.
- Finish a lesson while signed in: XP and the lesson appear on the account page, also after signing out and in.
- Open the site in a second browser: sign in there; change the password in the first one: the second is signed out.
- `npm run e2e` runs these flows in a real browser when `DATABASE_URL` is set (use a throwaway database, because the tests create accounts).
