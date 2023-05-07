@echo off

:: Copy compiled plugin to node_modules folder so that typedoc finds it
echo ===================================== SETTING UP THE PLUGIN ========================================
rmdir /S /Q ..\node_modules\typedoc-plugin-merge-modules 2>nul
mkdir ..\node_modules\typedoc-plugin-merge-modules\dist 2>nul
copy ..\package.json ..\node_modules\typedoc-plugin-merge-modules
xcopy ..\dist ..\node_modules\typedoc-plugin-merge-modules\dist /s /e

:: Create documentation for merge OFF
echo ===================================== TEST MERGE OFF ===============================================
call npx typedoc --tsconfig merge-off/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode off --entryPointStrategy expand --out merge-off/output merge-off/input
call npx cypress run --quiet --spec "merge-off/test.cy.ts"

:: Create documentation for merge PROJECT
echo ===================================== TEST MERGE PROJECT ===========================================
call npx typedoc --tsconfig merge-project/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode project --entryPointStrategy expand --out merge-project/output merge-project/input
call npx cypress run --quiet --spec "merge-project/test.cy.ts"

:: Create documentation for merge MODULE
echo ===================================== TEST MERGE MODULE ============================================
call npx typedoc --tsconfig merge-module/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy expand --out merge-module/output merge-module/input
call npx cypress run --quiet --spec "merge-module/test.cy.ts"

:: Create documentation for merge MODULE CATEGORY
echo ===================================== TEST MERGE MODULE CATEGORY ===================================
call npx typedoc --tsconfig merge-module-category/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module-category --entryPointStrategy expand --out merge-module-category/output merge-module-category/input
call npx cypress run --quiet --spec "merge-module-category/test.cy.ts"

:: Create documentation with DEFAULT EXPORT RENAMING ON
echo ===================================== TEST DEFAULT EXPORT RENAMING ON ==============================
call npx typedoc --tsconfig default-export-rename-on/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesRenameDefaults true --entryPointStrategy expand --out default-export-rename-on/output default-export-rename-on/input
call npx cypress run --quiet --spec "default-export-rename-on/test.cy.ts"

:: Create documentation with DEFAULT EXPORT RENAMING OFF
echo ===================================== TEST DEFAULT EXPORT RENAMING OFF =============================
call npx typedoc --tsconfig default-export-rename-off/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesRenameDefaults false --entryPointStrategy expand --out default-export-rename-off/output default-export-rename-off/input
call npx cypress run --quiet --spec "default-export-rename-off/test.cy.ts"

:: Create documentation for merge PROJECT using a monorepo
echo ===================================== TEST MERGE PROJECT ON MONOREPO ===============================
call npx typedoc --tsconfig merge-project-monorepo/tsconfig.json --plugin typedoc-plugin-merge-modules --entryPointStrategy packages --out merge-project-monorepo/output merge-project-monorepo/input/project1 merge-project-monorepo/input/project2
call npx cypress run --quiet --spec "merge-project-monorepo/test.cy.ts"

:: TODO
:: test merge for monorepo project

echo ===================================== FINISHED =====================================================
