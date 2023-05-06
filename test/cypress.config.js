const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        specPattern: "**/*.cy.ts",
        supportFile: false,
    },
});
