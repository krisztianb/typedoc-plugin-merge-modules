import { defineConfig } from "cypress";

const config = defineConfig({
    e2e: {
        specPattern: "**/*.cy.ts",
        supportFile: false,
        video: false,
        screenshotOnRunFailure: false,
    },
});

export default config;
