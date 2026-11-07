# Adding an interface language

The interface (buttons, menus, messages, FAQ, legal pages) is translated per language. Lesson content is separate: course text stays in the course's own language (see `src/content`). Missing translations fall back to English automatically, so a language can be added in stages.

1. Add one row to `LOCALES` in `src/i18n/config.ts` (code, native name, hreflang, Open Graph locale, and `dir`: `"ltr"` or `"rtl"`). Use the BCP 47 tag for `hreflang`, for example `pt-BR` or `hi`.
2. Copy `src/i18n/packs/es.ts` to `src/i18n/packs/<code>.ts`, rename the export, and translate. Keys you leave out use English.
3. Register it in `src/i18n/packs/index.ts`.
4. Run `npm test`. The i18n tests check that every key exists, that nothing is empty and that the pack is really translated, not English. Sitemap, hreflang, robots, language switcher and footer links update by themselves.
5. No database change is needed: `profiles.interface_locale` accepts any language code.

Have a native speaker review each pack. The privacy and terms texts are drafts and need a proper review in every language.

Bengali (`bn`) and English are written in full in `src/i18n/*.ts` instead of a pack. Translate new English strings there too, or TypeScript will tell you what is missing.

## Right-to-left languages (Arabic, and later Hebrew, Urdu, Persian)
Set `dir: "rtl"` in the config row. The page then mirrors: layout, spacing, back and forward arrows. Rules that keep it working: use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`) instead of `ml-`, `mr-`, `left-`, `text-left`, and use `BackArrow` / `ForwardArrow` from `src/components/Arrows.tsx` instead of typing arrows. A test fails if physical classes sneak back in. Lesson sentences stay left-to-right because course text is written in left-to-right scripts. For a course taught in an RTL language, review the exercise components first.

## English courses for speakers of an interface language
`src/content/english-for.ts` builds an "English for <language> speakers" course from one shared list of English words plus a small pack per language: course and unit titles, five instruction templates, and the meanings of 35 words (7 lessons). To add one, copy a block such as `fr`, translate it, add it to the list at the bottom, and run `npm test`. The tests check for duplicate meanings, valid answers and unique ids. The home page picks the English course that matches the visitor's interface language and falls back to the Bengali one.
For any other new lesson, use `vocabLesson` in `src/content/generate.ts` (`more: true` adds extra auto-generated questions).
