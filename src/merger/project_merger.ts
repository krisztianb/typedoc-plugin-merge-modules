import { ProjectReflection } from "typedoc";
import { Plugin } from "../plugin";
import { getModulesFrom } from "../utils";
import { ModuleBundle } from "./module_bundle";

/**
 * Merger that moves the content of all modules into the project root.
 */
export class ProjectMerger {
    /** The project whose modules are merged. */
    private readonly project: ProjectReflection;

    /** The plugin which is using this merger. */
    private readonly plugin: Plugin;

    /**
     * Creates a new merger instance.
     * @param project The project whose modules are merged.
     * @param plugin The plugin which is using this merger.
     */
    public constructor(project: ProjectReflection, plugin: Plugin) {
        this.project = project;
        this.plugin = plugin;
    }

    /**
     * Performs the merging routine.
     */
    public execute(): void {
        // In monorepo project each project is also a module => Recursively collect all modules
        const allModules = getModulesFrom(this.project);

        // Create a module bundle for all the modules
        const bundle = new ModuleBundle(this.project);
        allModules.forEach((module) => bundle.add(module));

        // Merge the bundle into the project
        bundle.merge(this.plugin.runsAfterCategorization, this.project);
    }
}
