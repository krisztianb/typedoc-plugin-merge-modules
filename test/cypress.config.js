// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/unbound-method
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        specPattern: "**/*.cy.ts",
        supportFile: false,
        video: false,
        screenshotOnRunFailure: false,
    },
});
