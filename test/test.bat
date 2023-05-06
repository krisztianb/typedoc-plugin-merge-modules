@echo off

:: Copy compiled plugin to node_modules folder so that typedoc finds it
echo ===================================== SETTING UP THE PLUGIN ========================================
rmdir /S /Q ..\node_modules\typedoc-plugin-merge-modules 2>nul
mkdir ..\node_modules\typedoc-plugin-merge-modules\dist 2>nul
copy ..\package.json ..\node_modules\typedoc-plugin-merge-modules
xcopy ..\dist ..\node_modules\typedoc-plugin-merge-modules\dist /s /e

:: Create documentation for NO merge
echo ===================================== TEST MERGE OFF ===============================================
rmdir /S /Q .\merge-off\output 2>nul
call npx typedoc --tsconfig merge-off/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode off --entryPointStrategy expand --out merge-off/output merge-off/input
call npx cypress run --spec "merge-off/test.cy.ts"

:: Create documentation for PROJECT merge
echo ===================================== TEST MERGE PROJECT ===========================================
rmdir /S /Q .\merge-project\output 2>nul
call npx typedoc --tsconfig merge-project/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode project --entryPointStrategy expand --out merge-project/output merge-project/input
call npx cypress run --spec "merge-project/test.cy.ts"

:: Create documentation for MODULE merge
echo ===================================== TEST MERGE MODULE ============================================
rmdir /S /Q .\merge-module\output 2>nul
call npx typedoc --tsconfig merge-module/tsconfig.json --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy expand --out merge-module/output ./merge-module/input
call npx cypress run --spec "merge-module/test.cy.ts"

:: TODO
:: test module-category merge
:: test merge for monorepo project
:: test default export renaming feature

echo ===================================== FINISHED =====================================================
