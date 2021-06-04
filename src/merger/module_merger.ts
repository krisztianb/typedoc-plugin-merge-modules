import { DeclarationReflection, ProjectReflection, ReflectionKind } from "typedoc";

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
        const modules = (this.project.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));

        // conbine module DeclarationReflection by its module name
        const combinedModules: Record<string, DeclarationReflection[]> = {};
        // eslint-disable-next-line no-confusing-arrow
        modules.forEach((module) =>
            Array.isArray(combinedModules[module.name])
                ? combinedModules[module.name].push(module)
                : (combinedModules[module.name] = [module]),
        );

        // reduce multiple DeclarationReflection into single declaration
        for (const modName in combinedModules) {
            const mods = combinedModules[modName];
            const children = mods
                .map((m) => m.children)
                .filter((m): m is DeclarationReflection[] => m !== undefined)
                .reduce((acc, val) => acc.concat(val), []);
            // use first module as a principle module
            children.forEach((child) => (child.parent = mods[0]));
            mods[0].children = children;
            // remove rest modules
            for (let i = 1; i < mods.length; i++) {
                mods[i].children = undefined;
                this.project.removeReflection(mods[i]);
            }
        }
    }
}
