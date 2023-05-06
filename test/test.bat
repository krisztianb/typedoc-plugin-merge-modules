@echo off

:: Copy compiled plugin to node_modules folder so that typedoc finds it
echo ====================================== SETTING UP PLUGIN ======================================
rmdir /S /Q ..\node_modules\typedoc-plugin-merge-modules 2>nul
mkdir ..\node_modules\typedoc-plugin-merge-modules\dist 2>nul
copy ..\package.json ..\node_modules\typedoc-plugin-merge-modules
xcopy ..\dist ..\node_modules\typedoc-plugin-merge-modules\dist /s /e

:: Create documentation for NO merge
echo ====================================== TEST MERGE OFF =========================================
rmdir /S /Q .\merge-off 2>nul
call npx typedoc --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode off --entryPointStrategy expand --out merge-off ../src

:: Create documentation for PROJECT merge
echo ====================================== TEST MERGE PROJECT =====================================
rmdir /S /Q .\merge-project 2>nul
call npx typedoc --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode project --entryPointStrategy expand --out merge-project ../src

:: Create documentation for MODULE merge
echo ====================================== TEST MERGE MODULE ======================================
rmdir /S /Q .\merge-module 2>nul
call npx typedoc --plugin typedoc-plugin-merge-modules --mergeModulesMergeMode module --entryPointStrategy expand --out merge-module ../src
