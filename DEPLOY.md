# Deploying MugoX Lingo (preview first)

This app is independent from the existing MugoX site. Do not point mymugox.com at it until it is reviewed.

## 1. Preview deployment on Vercel
1. Push this folder to a NEW GitHub repo (`mugox-language`). Never reuse the old site's repo or Vercel project.
2. In Vercel: Add New Project, import the repo, framework Next.js (auto-detected), keep default build settings.
3. Environment Variables (Preview and Production). Add them BEFORE the first build, because `NEXT_PUBLIC_*` values are baked in at build time:
   - `NEXT_PUBLIC_SITE_URL` = the preview URL (later the final domain)
   - `DATABASE_URL` (Neon connection string; server only, never prefix with NEXT_PUBLIC_)
   - `NEXT_PUBLIC_CONTACT_EMAIL` (shown on the contact page; AdSense expects a real contact address)
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, optional `NEXT_PUBLIC_ADSENSE_SLOT` (see `SEO_ANALYTICS.md`)
   - `NEXT_PUBLIC_GA_ID` (a NEW GA4 property) and `NEXT_PUBLIC_GSC_VERIFICATION`, both optional, see `SEO_ANALYTICS.md`
4. Apply the schema once with `npm run db:migrate` on your computer (it reads `.env.local`). Use a separate Neon branch for previews if you can.
5. Redeploy after changing any env variable.

## 2. Before any domain change
- Review the preview on phone and desktop, in English and Bengali; run the first-run checklist in `SETUP.md`.
- Have a person review `/privacy` and `/terms`. They are drafts, not legal advice.
- Audit the old site's URLs (sitemap, Search Console, analytics) and write a 301 map from each old URL to its closest equivalent here. Do not redirect everything to the homepage.
- Switch the domain in Vercel only after approval; keep the old deployment available for rollback.
- Update `NEXT_PUBLIC_SITE_URL` to the final domain, then redeploy. Session cookies are marked Secure automatically when the site URL starts with https.

## 3. Checks to run
    npm run typecheck && npm run lint && npm test && npm run build
    npx playwright install chromium && npm run e2e     # end-to-end (builds and serves the app itself)

## Known limits
- The burst rate limiter is per server instance. Add a shared store (e.g. Upstash) for strict limits.
- Lesson text is English-only (the course is for English speakers); interface chrome is English/Bengali.
- Listening and review exercises are not built yet (no audio/TTS provider chosen).

## Chinese pronunciation and audio
- Pinyin is stored with the lesson text as `{汉字|pinyin}` tokens (see `src/content/zh.ts`) and shown with tone colours. The tests check that every token has one syllable per character; they cannot check that a tone mark is linguistically right. Have a native Mandarin speaker review `src/content/zh.ts` before you promote the course.
- Audio uses the browser's built-in speech voices (zh-CN, es-ES, bn-BD). It is machine speech, and quality and availability depend on the learner's device and browser. Where no voice exists, the app shows the word to read instead. For recorded native-speaker audio, add a TTS provider or audio files later.
- Listening exercises are practice only: they never count towards XP, scores or exams.

## Japanese, Korean and English-for-Bengali courses
- Japanese shows romaji above kana/kanji and Korean shows Revised Romanization above Hangul (`src/content/ja.ts`, `src/content/ko.ts`). Neither has been reviewed by a native speaker; please have one check them, especially the Japanese kanji choices and the Korean polite forms.
- The English course (`src/content/en-for-bn.ts`) gives its instructions in Bengali. Have a Bengali speaker proofread the wording.
- Audio uses device voices for ja-JP, ko-KR, en-US, zh-CN, es-ES and bn-BD. Where a device has no voice, listening exercises show the word to read instead.

## Content size and how lessons are built
- About 52 lessons across six courses. Most newer lessons are generated from a vocabulary list by `src/content/generate.ts` (meaning, reverse meaning, listening, matching, translation) plus hand-written fill-in and sentence-building extras in `src/content/more.ts`.
- To add a lesson: call `vocabLesson({ id, title, objective, vocab: [4+ words with distinct meanings], extra: [...] })` and put it in a unit. The tests check ids, choices and answers automatically.
- Bengali romanization in `src/content/bn.ts` is a simplified learner spelling, not a formal standard. Please have a Bengali speaker check it.
