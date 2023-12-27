import { test, expect } from "@playwright/test";

test.beforeEach("initial setup", async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("locators", async ({ page }) => {
  await page.locator("input").first().click();

  // Select by id
  page.locator("#inputEmail");

  // by class values
  page.locator(".shape-rectangle");

  // by class Value all
  page.locator(
    'class="input-full-width size-medium status-basic shape-rectangle nb-transition"'
  );

  // combine different selectors
  page.locator("input[placeholder='Email'][nbinput]");

  // By partial match
  page.locator(':text("Using")');

  // exact match
  page.locatorP('text-is("Using the Grid")');
});

test("User facing locators", async ({ page }) => {
  // Role is the type of element we are trying to select
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign In" }).first().click();

  // By label
  await page.getByLabel("Email").first().click();

  // get by placeholder
  await page.getByPlaceholder("Jane Doe").click();

  // get by text
  await page.getByText("Using the Grid").click();

  // Identifier you can create yourself when testing. Using data-testId="SignIn"
  await page.getByTestId("SignIn").click();

  await page.getByTitle("IoT Dashboard").click();
});

// Benefit of using filter is you can change multiple to get what you want
test("locating child elements", async ({ page }) => {
  // Chaining
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign In" })
    .first()
    .click();

  await page.locator("nb-card").nth(3).getByRole("button").click();
});

// We need to find something unique about the parents to select specific child elements
test("locating parent elements", async ({ page }) => {
  // Aproach 1
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign In" })
    .getByRole("textbox", { name: "Email" })
    .click();

  // No recommended
  await page
    .locator(":text-is('Using the Grid')")
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  await basicForm.getByRole("textbox", { name: "Password" }).fill("welcome123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button", { name: "Submit" }).click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("extracting values", async ({ page }) => {
  // Single text value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" });
  const buttonText = await basicForm.locator("button").textContent();

  await expect(buttonText).toEqual("Submit");

  // get all text value
  const allRadioButtonLabels = await page.locator("nb-radio").allTextContents();
  await expect(allRadioButtonLabels).toContain("Option 1");

  // input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();

  await expect(emailValue).toEqual("test@test.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  await expect(placeholderValue).toEqual("Email");
});

test("assertions", async ({ page }) => {
  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .locator("button");

  // General Assertions -> does not wait, has no time out
  const value = 5;
  expect(value).toEqual(5);

  const text = await basicFormButton.textContent();
  expect(text).toEqual("Submit");

  // Locator Assertion -> will wait and have a default timeout
  await expect(basicFormButton).toHaveText("Submit");

  // Soft assertion -> does not stop test execution -> Not considered good practice
  await expect.soft(basicFormButton).toHaveText("Submit2");
  await basicFormButton.click();
});
