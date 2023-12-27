import { test } from "@playwright/test";

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
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .getByRole("textbox", { name: "Email" })
    .fill("test@test.com");
});
