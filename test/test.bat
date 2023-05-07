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
call npx cypress run --spec "merge-off/test.cy.ts"

:: Create documentation for merge PROJECT
echo ===================================== TEST MERGE PROJECT ===========================================
call npx typedoc --tsconfig merge-project/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode project --entryPointStrategy expand --out merge-project/output merge-project/input
call npx cypress run --spec "merge-project/test.cy.ts"

:: Create documentation for merge MODULE
echo ===================================== TEST MERGE MODULE ============================================
call npx typedoc --tsconfig merge-module/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy expand --out merge-module/output merge-module/input
call npx cypress run --spec "merge-module/test.cy.ts"

:: Create documentation for merge MODULE CATEGORY
echo ===================================== TEST MERGE MODULE CATEGORY ===================================
call npx typedoc --tsconfig merge-module-category/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module-category --entryPointStrategy expand --out merge-module-category/output merge-module-category/input
call npx cypress run --spec "merge-module-category/test.cy.ts"

:: TODO
:: test default export renaming feature
:: test merge for monorepo project

echo ===================================== FINISHED =====================================================
