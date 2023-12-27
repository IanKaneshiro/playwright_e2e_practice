import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  await successButton.click();

  //   const text = await successButton.textContent();
  await successButton.waitFor({ state: "attached" });
  const text = await successButton.allTextContents();

  await expect(text).toEqual("Data loaded with get AJAX request");

  await expect(successButton).toHaveText("Data loaded with get AJAX request", {
    timeout: 20000,
  });
});

test("alternative ways", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // __ wait for element
  //   await page.waitForSelector(".bg-success");

  //   // __ wait for particular response
  //   await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  // __ wait for network calls to be completed -> NOT recommended

  // Waits for all network request to be finished, this is also NOT recommended
  await page.waitForLoadState("networkidle");

  const text = await successButton.allTextContents();
  await expect(text).toContain("Data loaded with get AJAX request");
});

test("timeouts", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  await successButton.click(); // Default test timeout is 30 seconds or 30000 milliseconds
});
