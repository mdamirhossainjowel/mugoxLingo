# SEO and Google Analytics

## Brand: MugoX Lingo
The product name lives in `src/lib/brand.ts`. Change `BRAND.name` there and every title, header, Open Graph image, structured data block and manifest follows. "MugoX" stays in the name.

## Staying separate from the existing MugoX site
- **Analytics:** create a NEW GA4 property and web data stream for this app and put its `G-...` id in `NEXT_PUBLIC_GA_ID`. Never reuse the id of another MugoX site, or the two sites' reports would mix. With no id set, no analytics code is loaded.
- **Cookies:** gtag cookies use the prefix `mgxl` (`mgxl_ga`, `mgxl_ga_<ID>`), so they cannot clash with `_ga` cookies from the old site on the same parent domain.
- **Browser storage:** every localStorage key starts with `mugoxlingo:` (progress, flashcards, exams, consent, pinyin setting). A test fails if a raw key sneaks in.
- **Search Console:** add the new site as its own property (best: a subdomain such as `learn.mymugox.com`) and submit `https://<your-domain>/sitemap.xml`. Use `NEXT_PUBLIC_GSC_VERIFICATION` for the HTML-tag method. Keep the old site's property untouched.
- **URLs:** this app uses `/<language>/...`. Do not host it on the same domain root as a site that already uses those paths. A subdomain avoids overlap. `NEXT_PUBLIC_SITE_URL` must be the final public URL, because canonical links, hreflang, the sitemap and structured data use it.
- **Redirects:** audit the old site's URLs before any domain change and map each to its closest equivalent with a 301 (see `DEPLOY.md`).

## Analytics and privacy
- Consent first: Google Analytics loads only after a visitor accepts the banner (shown only when `NEXT_PUBLIC_GA_ID` is valid). The choice can be changed with "Cookie settings" in the footer. Declining removes the `mgxl_ga*` cookies.
- No names, emails or free text are sent. Google signals and ad personalization are off.
- Events: `page_view`, `lesson_complete`, `exam_submit`, `locale_change`, with ids and numbers only.
- The privacy page describes this, in every language. It is a draft: have it reviewed for the countries you serve.

## SEO built in
Per-language titles and descriptions, canonical URLs, hreflang for every language plus `x-default` (`/en`), a sitemap with language alternates, `robots.txt` that blocks account, login and lesson pages in every language, Open Graph and Twitter cards with `og:locale` alternates, JSON-LD (Organization, WebSite, FAQPage), a web manifest and favicon. Private routes also send `noindex`.

Known limit: the page language (`<html lang>`) is set in the browser, because one shared root layout serves all languages. The visible content, `hreflang` and structured data carry the language for search engines.

## Google AdSense
- **Ids:** `NEXT_PUBLIC_ADSENSE_CLIENT_ID` accepts `pub-123…` or `ca-pub-123…`. `NEXT_PUBLIC_ADSENSE_SLOT` is optional (an ad unit id from Ads > By ad unit). With no slot, no manual ad is drawn; with auto ads switched on in AdSense, Google may place ads itself.
- **ads.txt:** served at `/ads.txt` with the line `google.com, pub-…, DIRECT, f08c47fec0942fa0`. It must be reachable at the root of the domain that shows the ads. If this app runs on a subdomain, the subdomain's own `/ads.txt` is used only if the root domain's `ads.txt` points to it; otherwise add the same line to the root domain's file.
- **Where ads appear:** only on the home page and the About page, and only after the visitor accepts cookies. Never in lessons, exams, sign-in or account pages: the script is not loaded there and a CSS rule hides any ad that Google's auto ads might insert.
- **Personalization:** off by default (`requestNonPersonalizedAds`), because children also use the site. Set `NEXT_PUBLIC_ADSENSE_PERSONALIZED=true` only if you decide to.
- **Children:** if the site is meant for children, AdSense treats it as child-directed content with strict rules (no personalized ads, limited ad types). Decide this honestly in AdSense's Sites settings. The terms say accounts are for 13 and over.
- **EEA, UK, Switzerland:** Google requires a certified consent tool before it serves ads there. This banner is not Google-certified. Use Google's free "Privacy & messaging" (Funding Choices) message in the AdSense console if you want ads for those visitors.
- **Pages AdSense expects:** About, Contact (set `NEXT_PUBLIC_CONTACT_EMAIL`, otherwise the page says no address is configured), Privacy Policy (includes the Google advertising disclosure) and Terms. All exist in all ten languages.
- **Before applying:** the site must be public on your domain with `ads.txt` live, the contact email set, the privacy and terms drafts reviewed, and enough real content. AdSense can still reject sites it finds thin; approval is Google's decision.
- **Variables from your other project:** `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and `NEXTAUTH_TRUST_HOST` belong to a Next-Auth setup. This app has its own sign-in and does not read them. Do not paste secrets into chats or share `.env` files.
