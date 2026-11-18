import { expect, test, type Page } from "@playwright/test";

/** Replaces the browser's speech engine with a fake, so we can check what the page asks it to do. */
async function fakeSpeech(page: Page, mode: "plays" | "silent" | "missing") {
  await page.addInitScript((m) => {
    const w = window as unknown as Record<string, unknown>;
    w.__spoken = [];
    // speechSynthesis is a read-only property of window, so it has to be redefined, not assigned.
    if (m === "missing") { delete w.SpeechSynthesisUtterance; Object.defineProperty(window, "speechSynthesis", { value: undefined, configurable: true }); return; }
    w.SpeechSynthesisUtterance = class { text: string; voice: unknown = null; lang = ""; rate = 1; volume = 1; onstart?: () => void; onend?: () => void; onerror?: () => void; constructor(t: string) { this.text = t; } };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      speaking: false, pending: false, getVoices: () => [], addEventListener() {}, removeEventListener() {}, cancel() {}, resume() {},
      speak(u: { text: string; lang: string; voice: unknown; onstart?: () => void; onend?: () => void }) {
        (w.__spoken as unknown[]).push({ text: u.text, lang: u.lang, hadVoice: Boolean(u.voice) });
        if (m === "plays") { setTimeout(() => u.onstart?.(), 10); setTimeout(() => u.onend?.(), 40); }
      },
    } });
  }, mode);
}
const spoken = (page: Page) => page.evaluate(() => (window as unknown as { __spoken: { text: string; lang: string; hadVoice: boolean }[] }).__spoken);

test("a phone that lists no voices can still play the audio (the old code left the buttons dead)", async ({ page }) => {
  await fakeSpeech(page, "plays");
  await page.goto("/en/learn/en-zh");
  const tone = page.getByRole("button", { name: /mā/ }).first();
  await expect(tone).toBeEnabled();
  await tone.click();
  await expect.poll(async () => (await spoken(page)).length).toBe(1);
  expect(await spoken(page)).toEqual([{ text: "妈", lang: "zh-CN", hadVoice: false }]);
  await page.waitForTimeout(3500);
  await expect(page.locator('[role="status"]', { hasText: "silent" })).toHaveCount(0);
});

test("when nothing starts playing, the learner is told what to check", async ({ page }) => {
  await fakeSpeech(page, "silent");
  await page.goto("/en/learn/en-zh");
  await page.getByRole("button", { name: /mā/ }).first().click();
  await expect(page.locator('[role="status"]', { hasText: "not on silent" })).toBeVisible({ timeout: 6000 });
});

test("the help message follows the interface language", async ({ page }) => {
  await fakeSpeech(page, "silent");
  await page.goto("/bn/learn/en-zh");
  await page.getByRole("button", { name: /mā/ }).first().click();
  await expect(page.locator('[role="status"]', { hasText: "সাইলেন্টে" })).toBeVisible({ timeout: 6000 });
});

test("a browser with no speech support shows disabled audio buttons instead of failing", async ({ page }) => {
  await fakeSpeech(page, "missing");
  await page.goto("/en/learn/en-zh");
  await expect(page.getByRole("button", { name: /mā/ }).first()).toBeDisabled();
});

test("a phone whose speak() throws does not crash the page and shows the help message", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speaking: false, pending: false, getVoices: () => [], addEventListener() {}, removeEventListener() {}, cancel() {}, resume() {}, speak() { throw new Error("NotAllowedError"); } } });
  });
  await page.goto("/en/learn/en-zh");
  await page.getByRole("button", { name: /mā/ }).first().click();
  await expect(page.locator('[role="status"]', { hasText: "not on silent" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("the listening exercise plays on tap and never gives the answer away while audio works", async ({ page }) => {
  await fakeSpeech(page, "plays");
  await page.goto("/en/learn/en-zh/zh-tones-1");
  await page.getByRole("button", { name: /1st tone/ }).click();
  await page.getByRole("button", { name: "Check" }).click(); await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /4th tone/ }).click();
  await page.getByRole("button", { name: "Check" }).click(); await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Listen");
  await page.getByRole("button", { name: "Play audio" }).click();
  await expect.poll(async () => (await spoken(page)).filter((s) => s.text === "马").length).toBeGreaterThan(0);
  await expect(page.getByText("No voice for this language")).toHaveCount(0);
});
