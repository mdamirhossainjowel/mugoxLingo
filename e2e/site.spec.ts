import { expect, test } from "@playwright/test";

const LOCALES = ["en", "bn", "es", "zh", "ja", "ko", "hi", "ar", "fr", "pt"];
const EMAIL = "mymugox@gmail.com";

test("Privacy, Terms, About and Contact load in every language, with a unique title, a canonical link and the official email", async ({ request }) => {
  for (const code of LOCALES) {
    const titles = new Set<string>();
    for (const page of ["about", "privacy", "terms", "contact"]) {
      const res = await request.get(`/${code}/${page}`);
      expect(res.status(), `${code}/${page}`).toBe(200);
      const html = await res.text();
      expect(html, `${code}/${page} lang`).toMatch(new RegExp(`<html lang="[^"]+" dir="(ltr|rtl)"`));
      expect(html, `${code}/${page} noindex`).not.toMatch(/name="robots" content="[^"]*noindex/);
      expect(html.match(/<h1/g)?.length, `${code}/${page} h1`).toBe(1);
      expect(html, `${code}/${page} canonical`).toMatch(new RegExp(`<link rel="canonical" href="https?://[^"]+/${code}/${page}"`));
      expect((html.match(/rel="alternate" hrefLang="/gi) ?? []).length, `${code}/${page} hreflang`).toBeGreaterThanOrEqual(11);
      if (page !== "about") expect(html, `${code}/${page} email`).toContain(`mailto:${EMAIL}`);
      expect(html).not.toContain("{email}");
      titles.add(html.match(/<title>(.*?)<\/title>/)![1]);
    }
    expect(titles.size, `${code} titles`).toBe(4);
  }
});

test("sitemap.xml is valid, simple and complete; robots.txt is correct", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml.startsWith("<?xml")).toBe(true);
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  expect(new Set(locs).size).toBe(locs.length);
  expect(locs.length).toBeGreaterThanOrEqual(56);
  for (const l of locs) expect(l).toMatch(/^https?:\/\/[^/]+\/(en|bn|es|zh|ja|ko|hi|ar|fr|pt)(\/[a-z0-9-]+)*$/);
  expect(xml).not.toMatch(/<lastmod>|<changefreq>|<priority>/);
  expect(xml).toContain('hreflang="x-default"');
  expect(locs.some((l) => /\/(account|login|signup|learn|api)(\/|$)/.test(l))).toBe(false);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("User-Agent: Mediapartners-Google");
  expect(robots).toMatch(/Sitemap: https?:\/\/[^/\s]+\/sitemap\.xml/);
  for (const p of ["/en/account", "/en/login", "/en/signup", "/api/", "/auth/"]) expect(robots).toContain(`Disallow: ${p}`);
  expect(robots).not.toContain("Disallow: /en/learn");
});

test("learning guides are public English pages with tables, structured data and honest language links", async ({ page, request }) => {
  await page.goto("/en/guides");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Learning guides");
  await expect(page.locator("main h2 a")).toHaveCount(5);
  await page.getByRole("link", { name: "Mandarin tones and pinyin for beginners" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mandarin tones");
  await expect(page.locator("table").first()).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  const html = await (await request.get("/en/guides/mandarin-tones-and-pinyin")).text();
  expect(html).toContain('"@type":"Article"'); expect(html).toContain('"@type":"BreadcrumbList"');
  expect((html.match(/rel="alternate" hrefLang="/gi) ?? []).length).toBe(2); // English and x-default only
  expect((await request.get("/ja/guides")).status()).toBe(404);
  expect((await request.get("/en/guides/not-a-guide")).status()).toBe(404);
});

test("the home page explains what MugoX Lingo is, links every public page, and has no old tools content", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "A language-learning game for every age" })).toBeVisible();
  const footer = page.getByRole("navigation", { name: "Footer" });
  for (const name of ["About", "Learning guides (English)", "Privacy", "Terms", "Contact"]) await expect(footer.getByRole("link", { name })).toBeVisible();
  await page.getByText("How do I delete my account?").click();
  await expect(page.getByText(EMAIL, { exact: false }).first()).toBeVisible();
  const body = (await page.locator("body").innerText()).toLowerCase();
  for (const old of ["36+", "free tools", "marketplace", "ai tools"]) expect(body).not.toContain(old);
});

test("every internal link on the home page and the public pages works", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of ["/en", "/en/about", "/en/privacy", "/en/terms", "/en/contact", "/en/guides"]) {
    await page.goto(path);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!));
    for (const h of hrefs) {
      const clean = h.split("#")[0]; if (!clean || seen.has(clean)) continue; seen.add(clean);
      const res = await request.get(clean);
      expect(res.status(), `${path} -> ${clean}`).toBeLessThan(400);
    }
  }
  expect(seen.size).toBeGreaterThan(15);
});

test("the contact page works without a form: mailto link and a copy button", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page.getByRole("link", { name: EMAIL }).first()).toHaveAttribute("href", /^mailto:mymugox@gmail\.com/);
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByText("Email address copied")).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
});

test("keyboard users reach a skip link first, and every form field has a label", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.goto("/en/signup");
  for (const label of ["Your name", "Email", "Password"]) await expect(page.getByLabel(label)).toBeVisible();
});

test("social-sharing images and canonical links are absolute on every kind of public page", async ({ request }) => {
  for (const path of ["/en", "/zh/about", "/ar/privacy", "/en/guides", "/en/guides/korean-hangul-basics"]) {
    const html = await (await request.get(path)).text();
    const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    expect(og, `${path} og:image`).toMatch(/^https?:\/\//);
    expect(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], `${path} canonical`).toMatch(/^https?:\/\//);
  }
});

test("nothing scrolls sideways on a small phone screen, in any language, including the guide tables", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const paths = ["/en", "/bn", "/es", "/zh", "/ja", "/ko", "/hi", "/ar", "/fr", "/pt"].flatMap((p) => [p, `${p}/privacy`, `${p}/contact`]);
  paths.push("/en/guides", "/en/guides/numbers-1-to-10-chinese-japanese-korean", "/en/guides/mandarin-tones-and-pinyin", "/en/login", "/en/signup");
  for (const p of paths) {
    await page.goto(p);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${p} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
  }
});
