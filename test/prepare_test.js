/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

console.log("=================================== SETTING UP THE TESTS ===========================================");

if (!fs.existsSync(path.join("..", "dist"))) {
    console.error("ERROR: Cannot find 'dist' folder. Did you forget to build the plugin with 'npm run build'?");
    process.exit(1);
}

console.log("Copying current build of plugin to node_modules for testing...");
const modulesDir = path.join("..", "node_modules", "typedoc-plugin-merge-modules");

fs.rm(modulesDir, { recursive: true, force: true }, (rmErr) => {
    if (rmErr) {
        throw rmErr;
    }
    fs.mkdir(
        path.join(modulesDir, "dist"),
        { recursive: true },
        (mkDirErr) => {
            if (mkDirErr) {
                throw mkDirErr;
            } else {
                fs.copyFileSync(
                    path.join("..", "package.json"),
                    path.join(modulesDir, "package.json"),
                );
                fs.cpSync(
                    path.join("..", "dist"),
                    path.join(modulesDir, "dist"),
                    { recursive: true },
                );
            }
        });

});

console.log("DONE\n");
