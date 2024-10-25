/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

console.log("=================================== SETTING UP THE TESTS ===========================================");

if (!fs.existsSync(path.join("..", "dist"))) {
    console.error("ERROR: Cannot find 'dist' folder. Did you forget to build the plugin with 'npm run build'?");
    process.exit(1);
}

console.log("Copying current build of plugin to node_modules for testing...");
const nodeModulesSubDir = path.join("..", "node_modules", "typedoc-plugin-merge-modules");

fs.rm(nodeModulesSubDir, { recursive: true, force: true }, (rmErr) => {
    if (rmErr) {
        throw rmErr;
    }
    fs.mkdir(path.join(nodeModulesSubDir, "dist"), { recursive: true }, (mkDirErr) => {
        if (mkDirErr) {
            throw mkDirErr;
        } else {
            fs.copyFileSync(path.join("..", "package.json"), path.join(nodeModulesSubDir, "package.json"));
            fs.cpSync(path.join("..", "dist"), path.join(nodeModulesSubDir, "dist"), { recursive: true });
        }
    });
});

console.log("DONE\n");
