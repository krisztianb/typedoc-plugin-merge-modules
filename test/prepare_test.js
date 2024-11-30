import fs from "node:fs/promises";
import path from "node:path";

console.log("=================================== SETTING UP THE TESTS ===========================================");

if (
    !(await fs
        .access(path.join("..", "dist"))
        .then(() => true)
        .catch(() => false))
) {
    console.error("ERROR: Cannot find 'dist' folder. Did you forget to build the plugin with 'npm run build'?");
    process.exit(1);
}

console.log("Copying current build of plugin to node_modules for testing...");
const nodeModulesSubDir = path.join("..", "node_modules", "typedoc-plugin-merge-modules");

await fs.rm(nodeModulesSubDir, { recursive: true, force: true });
await fs.mkdir(path.join(nodeModulesSubDir, "dist"), { recursive: true });
await fs.copyFile(path.join("..", "package.json"), path.join(nodeModulesSubDir, "package.json"));
await fs.cp(path.join("..", "dist"), path.join(nodeModulesSubDir, "dist"), { recursive: true });

console.log("DONE\n");
