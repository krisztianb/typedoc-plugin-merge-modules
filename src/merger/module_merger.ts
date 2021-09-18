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
        const moduleCombinations = this.createModuleCombinations();

        for (const name in moduleCombinations) {
            this.mergeModules(moduleCombinations[name]);
        }
    }

    /**
     * Creates an object describing which modules of the project should be merged.
     * @returns The object describing which modules should be merged.
     */
    private createModuleCombinations(): Record<string, DeclarationReflection[]> {
        const modules = (this.project.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));
        const result: ReturnType<ModuleMerger["createModuleCombinations"]> = {};

        for (const module of modules) {
            if (Array.isArray(result[module.name])) {
                result[module.name].push(module);
            } else {
                result[module.name] = [module];
            }
        }

        return result;
    }

    /**
     * Merges the provided modules within the project into one module.
     * @param modules The modules which should be merged into one module.
     */
    private mergeModules(modules: DeclarationReflection[]): void {
        const childrenOfAllModules = modules
            .map((m) => m.children)
            .filter((m): m is DeclarationReflection[] => m !== undefined)
            .reduce((acc, val) => acc.concat(val), []);

        // use first module as a principle module
        childrenOfAllModules.forEach((child) => (child.parent = modules[0]));
        modules[0].children = childrenOfAllModules;

        // remove rest modules
        for (let i = 1; i < modules.length; ++i) {
            delete modules[i].children;
            this.project.removeReflection(modules[i]);
        }
    }
}
