// Smoke test locale: serve la pagina statica sulla porta 4108.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:4108/" },
  webServer: {
    command: "python -m http.server 4108",
    url: "http://localhost:4108/",
    reuseExistingServer: true,
  },
});
