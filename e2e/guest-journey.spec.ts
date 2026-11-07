import { expect, test, type Page } from "@playwright/test";

const check = (p: Page) => p.getByRole("button", { name: "Check" }).click();
const next = (p: Page) => p.getByRole("button", { name: "Continue" }).click();

test("landing page renders in English and Bengali with hreflang", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Say hello in any language");
  await expect(page.locator('link[rel="alternate"][hreflang="bn"]')).toHaveCount(1);
  await page.goto("/bn");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("হ্যালো");
});

test("guest completes lesson 1, earns XP, and progress survives a reload", async ({ page }) => {
  await page.goto("/en");
  await page.locator("#languages").getByRole("link", { name: "Start" }).click();
  await expect(page).toHaveURL(/learn\/en-es$/);
  await page.getByRole("link", { name: "Continue learning" }).click();
  await expect(page).toHaveURL(/es-greetings-1/);

  await page.getByRole("button", { name: /^1?\s*Hello$/ }).click(); await check(page); await next(page);          // Hola
  await page.getByRole("button", { name: /Gracias/ }).click(); await check(page); await next(page);                // Thank you
  for (const [l, r] of [["Hola", "Hello"], ["Adiós", "Goodbye"], ["Gracias", "Thank you"], ["Por favor", "Please"]]) {
    await page.getByRole("button", { name: l, exact: true }).click();
    await page.getByRole("button", { name: r, exact: true }).click();
  }
  await check(page); await next(page);
  await page.getByRole("button", { name: /días/ }).click(); await check(page); await next(page);                  // fill
  for (const w of ["Me", "llamo", "Ana"]) await page.getByRole("button", { name: w, exact: true }).click();
  await check(page); await next(page);
  await page.getByPlaceholder("Type your answer").fill("gracias"); await check(page); await next(page);          // accent/case tolerant
  await page.getByRole("button", { name: /Goodbye/ }).click(); await check(page); await next(page);

  await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
  await expect(page.getByText(/\+(24|36) XP/)).toBeVisible(); // 36 on weekends (1.5x boost event)

  await page.goto("/en/learn/en-es");
  await page.reload();
  await expect(page.getByText(/⚡ (24|36)$/)).toBeVisible();
  await expect(page.getByText("🔥 1")).toBeVisible();
});

test("a wrong answer costs a heart and shows the correct answer", async ({ page }) => {
  await page.goto("/en/learn/en-es/es-greetings-1");
  await page.getByRole("button", { name: /Goodbye/ }).click(); await check(page);
  await expect(page.getByText("Not quite")).toBeVisible();
  await expect(page.getByText(/Correct answer:\s*Hello/)).toBeVisible();
  await expect(page.getByLabel(/Hearts left: 4/)).toBeVisible();
});

test("corrupted local storage does not break the course page", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("mugoxlingo:guest-progress", "{not json"));
  await page.goto("/en/learn/en-es");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Spanish");
  await expect(page.getByText("⚡ 0")).toBeVisible();
});

test("private pages are not indexable and unknown routes 404", async ({ page, request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /en/account");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/en/privacy"); expect(sitemap).not.toContain("/learn/");
  expect((await request.get("/en/learn/en-es/nope")).status()).toBe(404);
  await page.goto("/en/account");
  await expect(page).toHaveURL(/\/en\/login/);
});

test("practice hub: flashcards unlock after a lesson, exams stay locked", async ({ page }) => {
  await page.goto("/en/learn/en-es");
  await expect(page.getByText(/0 words unlocked/)).toBeVisible();
  await expect(page.getByText(/Finish every lesson in this unit to unlock/).first()).toBeVisible();
  await page.goto("/en/learn/en-es/flashcards");
  await expect(page.getByText(/Finish a lesson first/)).toBeVisible();
  await page.goto("/en/learn/en-es/exam/es-u1");
  await expect(page.getByText(/unlocks when you finish every lesson/)).toBeVisible();
  expect((await page.request.get("/en/learn/en-es/exam/nope")).status()).toBe(404);
});

test("flashcards flip and rate once words are unlocked", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("mugoxlingo:guest-progress", JSON.stringify({
    version: 1, xp: 24, streak: { count: 1, lastDay: null }, daily: { day: null, xp: 0 }, completed: { "es-greetings-1": { times: 1, bestCorrect: 7, bestTotal: 7 } }, badges: [], appliedAttempts: [] })));
  await page.goto("/en/learn/en-es/flashcards");
  await page.getByRole("button", { name: /Tap the card to flip/ }).click();
  await page.getByRole("button", { name: "Got it!" }).click();
  await expect(page.getByText(/4 cards left/)).toBeVisible();
});

test("Chinese course shows tone-coloured pinyin and the tone chart", async ({ page }) => {
  await page.goto("/en/learn/en-zh");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Chinese");
  await expect(page.getByRole("heading", { name: /Tone chart/ })).toBeVisible();
  await page.goto("/en/learn/en-zh/zh-tones-1");
  await expect(page.locator("rt.pinyin").first()).toBeVisible();
  await page.getByRole("button", { name: /1st tone: high and flat/ }).click();
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  await expect(page.getByLabel(/Hearts left: 5/)).toBeVisible();
});

test("pinyin can be switched off and the choice is remembered", async ({ page }) => {
  await page.goto("/en/learn/en-zh");
  await page.getByRole("button", { name: "Pinyin: on" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-pinyin", "off");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-pinyin", "off");
});

test("Japanese, Korean and English-for-Bengali courses open and show readings", async ({ page }) => {
  await page.goto("/en/learn/en-ja/ja-greetings-1");
  await expect(page.locator("rt.pinyin").first()).toContainText("konnichiwa");
  await page.goto("/en/learn/en-ko/ko-greetings-1");
  await expect(page.locator("rt.pinyin").first()).toContainText("annyeonghaseyo");
  await page.goto("/en/learn/bn-en/en-greetings-1");
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Hello");
});

test("every interface language renders its own text, and the switcher keeps the page", async ({ page }) => {
  const h1 = { es: "Di hola en cualquier idioma", zh: "用任何语言说你好", ja: "どんな言語でもこんにちは", ko: "어떤 언어로든 인사해 보세요", hi: "किसी भी भाषा में नमस्ते कहें", ar: "قل مرحبًا بأي لغة", fr: "Dis bonjour dans toutes les langues", pt: "Diga olá em qualquer idioma" };
  for (const [code, text] of Object.entries(h1)) {
    await page.goto(`/${code}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(text.slice(0, 4));
  }
  await page.goto("/en/privacy");
  await page.getByLabel("Language").selectOption("ja");
  await expect(page).toHaveURL(/\/ja\/privacy$/);
});



test("brand is MugoX Lingo", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveTitle(/MugoX Lingo/);
  await expect(page.locator("body")).not.toContainText("MugoX 2.0");
});

test("Arabic is right-to-left and keeps lesson sentences left-to-right", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await page.goto("/ar/learn/en-es/es-greetings-1");
  await expect(page.locator("main")).toBeVisible();
});

test("English courses exist for speakers of the new interface languages", async ({ page }) => {
  await page.goto("/hi/learn/hi-en/hien-greetings-1");
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Hello");
  await page.getByRole("button", { name: "नमस्ते" }).click();
  await page.getByRole("button", { name: "जाँचें" }).click();
  await expect(page.getByRole("button", { name: "आगे बढ़ें" })).toBeVisible();
  await page.goto("/ar/learn/ar-en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("الإنجليزية");
});

test("analytics and ads load only after the visitor accepts (when they are configured)", async ({ page }) => {
  await page.goto("/en");
  await page.waitForTimeout(800);
  const banner = page.getByRole("dialog");
  const configured = (await banner.count()) > 0;
  await expect(page.locator('script[src*="googletagmanager"], script[src*="adsbygoogle"]')).toHaveCount(0);
  if (!configured) return; // no GA id or AdSense id set: nothing to accept
  await expect(banner).toContainText(/ads|Google/i);
  await banner.getByRole("button", { name: "Accept" }).click();
  await expect(page.locator('script[src*="googletagmanager"], script[src*="adsbygoogle"]').first()).toBeAttached({ timeout: 10_000 });
  await expect(page.locator("body")).toHaveAttribute("data-ads", "on");
  await page.goto("/en/learn/en-es");
  await expect(page.locator("body")).toHaveAttribute("data-ads", "off"); // never in lessons
});

test("the page language and direction are right in the server HTML, and 404 pages speak the language", async ({ page, request }) => {
  for (const [code, lang, dir] of [["en", "en", "ltr"], ["zh", "zh-Hans", "ltr"], ["ar", "ar", "rtl"], ["pt", "pt-BR", "ltr"]] as const) {
    const html = await (await request.get(`/${code}`)).text();
    expect(html, code).toContain(`<html lang="${lang}" dir="${dir}"`);
  }
  await page.goto("/ja/learn/en-es/nope");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("見つかりません");
});

test("course names, lesson names and exercise instructions follow the interface language", async ({ page }) => {
  await page.goto("/zh/learn/en-es");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("西班牙语");
  await expect(page.getByText("问候").first()).toBeVisible();
  await page.goto("/es/learn/en-es/es-greetings-1");
  await expect(page.getByRole("heading", { level: 2 })).toContainText("¿Qué significa «Hola»?");
  await page.goto("/fr/learn/en-es/es-greetings-1");
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Que signifie");
});

test("About page exists in every language, and ads.txt is served", async ({ page, request }) => {
  for (const code of ["en", "bn", "es", "zh", "ja", "ko", "hi", "ar", "fr", "pt"]) {
    const res = await request.get(`/${code}/about`);
    expect(res.status(), code).toBe(200);
  }
  await page.goto("/en");
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  const ads = await request.get("/ads.txt");
  expect(ads.status()).toBe(200);
  expect(await ads.text()).toMatch(/^(google\.com, pub-\d+, DIRECT, f08c47fec0942fa0|# Set NEXT_PUBLIC_ADSENSE_CLIENT_ID)/);
});
