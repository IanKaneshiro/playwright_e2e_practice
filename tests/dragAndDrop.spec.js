import { test, expect } from "@playwright/test";

test("drag and drop with iframes", async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

  const frame = page.frameLocator("[rel-title='Photo Manager'] iframe");

  await frame
    .locator("li", { hasText: "High Tatras 2" })
    .dragTo(frame.locator("#trash"));

  // more precise control
  await frame.locator("li", { hasText: "High Tatras 4" }).hover();
  await page.mouse.down();
  await frame.locator("#trash").hover();
  await page.mouse.up();
  // Mouse goes up

  await expect(frame.locator("#trash li h5")).toHaveText([
    "High Tatras 2",
    "High Tatras 4",
  ]);
});

// Iframe is a website insdie of a website. It adds a page within your page.
// In order to get acces to iframe, we neeed to switch into it.
// testing
