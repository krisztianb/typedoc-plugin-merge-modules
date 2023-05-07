/** @module merger */
import { DeclarationReflection, ProjectReflection, ReflectionKind } from "typedoc";
import { ModuleBundle } from "./module_bundle";

/**
 * Merger that merges the content of modules based on their JSDoc module annotation.
 */
export class ModuleMerger {
    /** The project whose modules are merged. */
    protected readonly project: ProjectReflection;

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
     * Creates an identifier for the module's bundle.
     * @param module The module for which the identifier is generated.
     * @returns The identifier for the module's bundle.
     */
    // eslint-disable-next-line class-methods-use-this
    protected createModuleBundleId(module: DeclarationReflection): string {
        return module.name;
    }

    /**
     * Creates an object describing which modules of the project should be merged.
     * @returns The collection of module bundles.
     */
    protected createModuleBundles(): ModuleBundle[] {
        const modules = (this.project.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));
        const moduleBundleMap = new Map<string, ModuleBundle>();

        for (const module of modules) {
            const bundleId = this.createModuleBundleId(module);

            if (!moduleBundleMap.has(bundleId)) {
                moduleBundleMap.set(bundleId, new ModuleBundle(this.project));
            }

            moduleBundleMap.get(bundleId)?.add(module);
        }

        return [...moduleBundleMap.values()];
    }
}
