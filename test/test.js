/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require("child_process");
const fs = require("fs");

console.log("=================================== SETTING UP THE TESTS ===========================================");

if (!fs.existsSync("..\\dist")) {
    console.error("ERROR: Cannot find 'dist' folder. Did you forget to build the plugin with 'npm run build'?");
    process.exit(1);
}

console.log("Copying current build of plugin to node_modules for testing...");

fs.rm("..\\node_modules\\typedoc-plugin-merge-modules", { recursive: true, force: true });
fs.mkdirSync("..\\node_modules\\typedoc-plugin-merge-modules\\dist", { recursive: true });
fs.copyFileSync("..\\package.json", "..\\node_modules\\typedoc-plugin-merge-modules\\package.json");
fs.cpSync("..\\dist", "..\\node_modules\\typedoc-plugin-merge-modules\\dist", { recursive: true });

console.log("DONE\n");

console.log("===================================== TEST MERGE OFF ===============================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-off/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode off --entryPointStrategy expand --out merge-off/output merge-off/input", { stdio: "inherit" });
execSync("call npx cypress run --quiet --spec 'merge-off/test.cy.ts'", { stdio: "inherit" });

console.log("=================================== TEST MERGE PROJECT =============================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-project/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode project --entryPointStrategy expand --out merge-project/output merge-project/input", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'merge-project/test.cy.ts'", { stdio: "inherit" });

console.log("==================================== TEST MERGE MODULE =============================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-module/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy expand --out merge-module/output merge-module/input", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'merge-module/test.cy.ts'", { stdio: "inherit" });

console.log("================================ TEST MERGE MODULE CATEGORY ========================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-module-category/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module-category --entryPointStrategy expand --out merge-module-category/output merge-module-category/input", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'merge-module-category/test.cy.ts'", { stdio: "inherit" });

console.log("============================== TEST DEFAULT EXPORT RENAMING ON =====================================");
// prettier-ignore
execSync("npx typedoc --tsconfig default-export-rename-on/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesRenameDefaults true --entryPointStrategy expand --out default-export-rename-on/output default-export-rename-on/input", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'default-export-rename-on/test.cy.ts'", { stdio: "inherit" });

console.log("============================== TEST DEFAULT EXPORT RENAMING OFF ====================================");
// prettier-ignore
execSync("npx typedoc --tsconfig default-export-rename-off/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesRenameDefaults false --entryPointStrategy expand --out default-export-rename-off/output default-export-rename-off/input", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'default-export-rename-off/test.cy.ts'", { stdio: "inherit" });

console.log("=============================== TEST MERGE PROJECT ON MONOREPO =====================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-project-monorepo/tsconfig.json --plugin typedoc-plugin-merge-modules --entryPointStrategy packages --out merge-project-monorepo/output merge-project-monorepo/input/project1 merge-project-monorepo/input/project2", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'merge-project-monorepo/test.cy.ts'", { stdio: "inherit" });

console.log("=============================== TEST MERGE MODULE ON MONOREPO ======================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-module-monorepo/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy packages --out merge-module-monorepo/output merge-module-monorepo/input/project1 merge-module-monorepo/input/project2", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'merge-module-monorepo/test.cy.ts'", { stdio: "inherit" });

console.log("======================================== FINISHED ==================================================");
