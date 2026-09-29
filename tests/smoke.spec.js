// home -> classe -> progetto, piu' deep link, ricerca e gesto del blocco cappello.
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  // gli embed Snap! restano fuori dal test: rispondiamo con una pagina vuota
  await page.route("https://snap.berkeley.edu/**", (r) => r.fulfill({ contentType: "text/html", body: "<html><body>snap</body></html>" }));
});

test("home, classe e apertura di un progetto", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");

  const classes = page.getByTestId("classes").locator("a");
  await expect(classes).toHaveCount(6);
  await expect(page.getByTestId("class-2a_ronta")).toContainText("8 progetti");

  await page.getByTestId("class-2a_ronta").click();
  await expect(page).toHaveURL(/#2a_ronta$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ronta");
  const projects = page.getByTestId("project");
  await expect(projects).toHaveCount(8);

  await projects.first().click();
  const player = page.getByTestId("player");
  await expect(player).toBeVisible();
  await expect(page).toHaveURL(/#2a_ronta\/aiman-e-anita$/);
  await expect(player.locator("iframe")).toHaveAttribute("src", /snap\.berkeley\.edu\/embed\?projectname=Aiman/);
  await expect(player.getByRole("heading")).toHaveText("Aiman e Anita");

  await page.keyboard.press("Escape");
  await expect(player).toBeHidden();
  await expect(page).toHaveURL(/#2a_ronta$/);
  expect(errors).toEqual([]);
});

test("il link condiviso apre direttamente il progetto", async ({ page }) => {
  await page.goto("/#5_saffi_natale/diego-e-ettore");
  const player = page.getByTestId("player");
  await expect(player).toBeVisible();
  await expect(player.getByRole("heading")).toHaveText("Diego e Ettore");
  await player.getByRole("button", { name: "Chiudi" }).click();
  await expect(player).toBeHidden();
  await expect(page).toHaveURL(/#5_saffi_natale$/);
});

test("ricerca per nome", async ({ page }) => {
  await page.goto("/#2o_plauto");
  await expect(page.getByTestId("project")).toHaveCount(12);
  await page.getByTestId("search").fill("zzz");
  await expect(page.getByTestId("project")).toHaveCount(12);
  await expect(page.locator('[data-testid="project"]:visible')).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Nessun nome");
  await page.getByTestId("search").fill("");
  await expect(page.locator('[data-testid="project"]:visible')).toHaveCount(12);
});

test("trascinare il blocco cappello avvia il progetto", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#2a_ronta");
  const target = page.getByTestId("project").nth(1);
  await expect(target).toBeVisible();
  const from = await page.locator("#hat").boundingBox();
  const to = await target.boundingBox();
  await page.mouse.move(from.x + 30, from.y + 30);
  await page.mouse.down();
  await page.mouse.move(to.x + 60, to.y + 40, { steps: 12 });
  await expect(target).toHaveClass(/drop-target/);
  await page.mouse.up();
  await expect(page.getByTestId("player")).toBeVisible();
  await expect(page).toHaveURL(/#2a_ronta\/bianca-e-francesco$/);
});
