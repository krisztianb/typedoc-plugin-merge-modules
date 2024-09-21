/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require("child_process");
const execOptions = { stdio: "inherit" };

console.log("===================================== TEST MERGE OFF ===============================================");
execSync("cd merge-off && npx typedoc", execOptions);
execSync("call npx cypress run --quiet --spec 'merge-off/test.cy.ts'", execOptions);

console.log("=================================== TEST MERGE PROJECT =============================================");
execSync("cd merge-project && npx typedoc", execOptions);
execSync("npx cypress run --quiet --spec 'merge-project/test.cy.ts'", execOptions);

console.log("==================================== TEST MERGE MODULE =============================================");
execSync("cd merge-module && npx typedoc", execOptions);
execSync("npx cypress run --quiet --spec 'merge-module/test.cy.ts'", execOptions);

console.log("================================ TEST MERGE MODULE CATEGORY ========================================");
execSync("cd merge-module-category && npx typedoc", execOptions);
execSync("npx cypress run --quiet --spec 'merge-module-category/test.cy.ts'", execOptions);

console.log("============================== TEST DEFAULT EXPORT RENAMING ON =====================================");
execSync("cd default-export-rename-on && npx typedoc", execOptions);
execSync("npx cypress run --quiet --spec 'default-export-rename-on/test.cy.ts'", execOptions);

console.log("============================== TEST DEFAULT EXPORT RENAMING OFF ====================================");
execSync("cd default-export-rename-off && npx typedoc", execOptions);
execSync("npx cypress run --quiet --spec 'default-export-rename-off/test.cy.ts'", execOptions);

console.log("=============================== TEST MERGE PROJECT ON MONOREPO =====================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-project-monorepo/tsconfig.json --plugin typedoc-plugin-merge-modules --entryPointStrategy packages --out merge-project-monorepo/output merge-project-monorepo/input/project1 merge-project-monorepo/input/project2", execOptions);
execSync("npx cypress run --quiet --spec 'merge-project-monorepo/test.cy.ts'", execOptions);

console.log("=============================== TEST MERGE MODULE ON MONOREPO ======================================");
// prettier-ignore
execSync("npx typedoc --tsconfig merge-module-monorepo/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy packages --out merge-module-monorepo/output merge-module-monorepo/input/project1 merge-module-monorepo/input/project2", execOptions);
execSync("npx cypress run --quiet --spec 'merge-module-monorepo/test.cy.ts'", execOptions);

console.log("======================================== FINISHED ==================================================");
