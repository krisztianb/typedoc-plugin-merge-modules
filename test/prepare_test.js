/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

console.log("=================================== SETTING UP THE TESTS ===========================================");

if (!fs.existsSync("..\\dist")) {
    console.error("ERROR: Cannot find 'dist' folder. Did you forget to build the plugin with 'npm run build'?");
    process.exit(1);
}

console.log("Copying current build of plugin to node_modules for testing...");

fs.rm("..\\node_modules\\typedoc-plugin-merge-modules", { recursive: true, force: true }, (rmErr) => {
    if (rmErr) {
        throw rmErr;
    } else {
        fs.mkdir("..\\node_modules\\typedoc-plugin-merge-modules\\dist", { recursive: true }, (mkDirErr) => {
            if (mkDirErr) {
                throw mkDirErr;
            } else {
                fs.copyFileSync("..\\package.json", "..\\node_modules\\typedoc-plugin-merge-modules\\package.json");
                fs.cpSync("..\\dist", "..\\node_modules\\typedoc-plugin-merge-modules\\dist", { recursive: true });
            }
        });
    }
});

console.log("DONE\n");
