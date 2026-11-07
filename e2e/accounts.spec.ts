import { expect, test, type Page } from "@playwright/test";

// These tests create real accounts, so they only run when DATABASE_URL is set (see .env.example).
test.skip(!process.env.DATABASE_URL, "set DATABASE_URL to run the account tests");

const password = "correct horse 123";
// Next.js adds its own role="alert" route announcer, so target the form message only.
const formAlert = (p: Page) => p.locator('form p[role="alert"]');
const newEmail = () => `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

async function signUp(page: Page, email = newEmail(), name = "Ana") {
  await page.goto("/en/signup");
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/en\/account$/);
  return email;
}
async function logIn(page: Page, email: string, pw = password) {
  await page.goto("/en/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(pw);
  await page.getByRole("button", { name: "Log in" }).click();
}
const check = (p: Page) => p.getByRole("button", { name: "Check" }).click();
const next = (p: Page) => p.getByRole("button", { name: "Continue" }).click();

test("sign up, sign out, wrong password is refused, sign in again", async ({ page }) => {
  const email = await signUp(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ana");
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await logIn(page, email, "totally wrong password");
  await expect(formAlert(page)).toContainText("Wrong email or password");
  await logIn(page, email);
  await expect(page).toHaveURL(/\/en\/account$/);
  await page.goto("/en");
  await expect(page.getByRole("link", { name: "My account" })).toBeVisible();
});

test("a second sign-up with the same email is refused", async ({ page, browser }) => {
  const email = await signUp(page);
  const other = await (await browser.newContext({ baseURL: test.info().project.use.baseURL })).newPage();
  await other.goto("/en/signup");
  await other.getByLabel("Email").fill(email);
  await other.getByLabel("Password").fill(password);
  await other.getByRole("button", { name: "Create account" }).click();
  await expect(formAlert(other)).toContainText("already has an account");
});

test("private pages send signed-out visitors to the login page", async ({ page }) => {
  await page.goto("/en/account");
  await expect(page).toHaveURL(/\/en\/login\?next=/);
});

test("a finished lesson is saved to the account and survives signing out and in", async ({ page }) => {
  const email = await signUp(page, newEmail(), "Lena");
  await page.goto("/en/learn/en-es/es-greetings-1");
  await page.getByRole("button", { name: /^1?\s*Hello$/ }).click(); await check(page); await next(page);
  await page.getByRole("button", { name: /Gracias/ }).click(); await check(page); await next(page);
  for (const [l, r] of [["Hola", "Hello"], ["Adiós", "Goodbye"], ["Gracias", "Thank you"], ["Por favor", "Please"]]) {
    await page.getByRole("button", { name: l, exact: true }).click();
    await page.getByRole("button", { name: r, exact: true }).click();
  }
  await check(page); await next(page);
  await page.getByRole("button", { name: /días/ }).click(); await check(page); await next(page);
  for (const w of ["Me", "llamo", "Ana"]) await page.getByRole("button", { name: w, exact: true }).click();
  await check(page); await next(page);
  await page.getByPlaceholder("Type your answer").fill("gracias"); await check(page); await next(page);
  await page.getByRole("button", { name: /Goodbye/ }).click(); await check(page); await next(page);
  await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
  await expect(page.getByText(/\+(24|36) XP/)).toBeVisible();

  await page.goto("/en/account");
  await expect(page.getByText(/⚡ (24|36)$/)).toBeVisible();
  await expect(page.getByText("✓ Greetings")).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await logIn(page, email);
  await expect(page.getByText(/⚡ (24|36)$/)).toBeVisible();
});

test("changing the password needs the current one and signs out other devices", async ({ page, browser }) => {
  const email = await signUp(page);
  const second = await (await browser.newContext({ baseURL: test.info().project.use.baseURL })).newPage();
  await logIn(second, email);
  await expect(second).toHaveURL(/\/en\/account$/);

  await page.goto("/en/update-password");
  await page.getByLabel("Current password").fill("not my password");
  await page.getByLabel("New password").fill("a brand new password 9");
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(formAlert(page)).toContainText("current password is not correct");
  await page.getByLabel("Current password").fill(password);
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page).toHaveURL(/\/en\/account$/);

  await second.goto("/en/account"); // the other device was signed out
  await expect(second).toHaveURL(/\/en\/login/);
  await page.getByRole("button", { name: "Log out" }).click();
  await logIn(page, email, "a brand new password 9");
  await expect(page).toHaveURL(/\/en\/account$/);
});
