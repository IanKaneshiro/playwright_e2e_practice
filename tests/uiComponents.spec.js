import { test, expect } from "@playwright/test";

test.beforeEach("initial setup", async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts page", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    // Fill input field
    await usingTheGridEmailInput.fill("test@test.com");
    // Clear input field
    await usingTheGridEmailInput.clear();
    // Emulate keystrokes being pressed
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 500,
    });

    // generic assertion -> like 2 === 2
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // locator assertion => expecting the input to have a certain value. We need to await this
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });
});
