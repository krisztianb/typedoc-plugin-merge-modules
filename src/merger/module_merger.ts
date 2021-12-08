import { ProjectReflection, ReflectionKind } from "typedoc";
import { ModuleBundle } from "./module_bundle";

/**
 * Merger that merges the content of modules based on their JSDoc module annotation.
 */
export class ModuleMerger {
    /** The project whose modules are merged. */
    private readonly project: ProjectReflection;

    /**
     * Creates a new merger instance.
     * @param project The project whose modules are merged.
     */
    public constructor(project: ProjectReflection) {
        this.project = project;
    }

    /**
     * Performs the merging routine.
     */
    public execute(): void {
        const moduleBundles = this.createModuleBundles();
        moduleBundles.forEach((bundle) => bundle.merge());
    }

    /**
     * Creates an object describing which modules of the project should be merged.
     * @returns The collection of module bundles.
     */
    private createModuleBundles(): ModuleBundle[] {
        const modules = (this.project.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));
        const moduleBundleMap = new Map<string, ModuleBundle>();

        for (const module of modules) {
            if (!moduleBundleMap.has(module.name)) {
                moduleBundleMap.set(module.name, new ModuleBundle(module.name, this.project));
            }

            moduleBundleMap.get(module.name)?.add(module);
        }

        return [...moduleBundleMap.values()];
    }
}
