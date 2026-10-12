// cattura di verifica visiva (sviluppo): node .impeccable/shots.cjs <outdir>
const { chromium } = require("@playwright/test");
const out = process.argv[2];
const base = "http://localhost:4108/";
(async () => {
  const browser = await chromium.launch();
  const runs = [
    ["desktop", { viewport: { width: 1440, height: 900 } }],
    ["mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ];
  for (const [name, opts] of runs) {
    for (const scheme of ["light", "dark"]) {
      if (scheme === "dark" && name === "mobile") continue;
      const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce", colorScheme: scheme });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const sfx = scheme === "dark" ? "-dark" : "";
      await page.goto(base);
      await page.waitForFunction(() => document.querySelectorAll('[data-count]').length && [...document.querySelectorAll('[data-count]')].every((s) => /\d/.test(s.textContent)));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${out}/home-${name}${sfx}.png` });
      if (scheme === "light") await page.screenshot({ path: `${out}/home-${name}-full.png`, fullPage: true });
      await page.goto(base + "#5_saffi_natale");
      await page.waitForSelector('[data-testid="project"]');
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${out}/class-${name}${sfx}.png` });
      if (scheme === "light") {
        await page.screenshot({ path: `${out}/class-${name}-full.png`, fullPage: true });
        await page.click('[data-testid="project"] >> nth=2');
        await page.waitForSelector("#player[open] iframe");
        await page.waitForTimeout(3500);
        await page.screenshot({ path: `${out}/player-${name}.png` });
      }
      console.log(name, scheme, errors.length ? errors : "ok");
      await ctx.close();
    }
  }
  // gesto: stato di aggancio e "in esecuzione" (movimento pieno)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route("https://snap.berkeley.edu/**", (r) => r.fulfill({ contentType: "text/html", body: "<body></body>" }));
  await page.goto(base + "#2o_plauto");
  await page.waitForSelector('[data-testid="project"]');
  await page.waitForTimeout(900);
  const from = await page.locator("#hat").boundingBox();
  const to = await page.getByTestId("project").nth(4).boundingBox();
  await page.mouse.move(from.x + 30, from.y + 30);
  await page.mouse.down();
  await page.mouse.move(to.x + 90, to.y + 30, { steps: 10 });
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${out}/gesture-drop.png` });
  await page.mouse.up();
  await page.waitForTimeout(330);
  await page.screenshot({ path: `${out}/gesture-running.png` });
  await ctx.close();
  await browser.close();
})();
