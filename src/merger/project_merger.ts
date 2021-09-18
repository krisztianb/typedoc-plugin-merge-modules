import { ProjectReflection, ReflectionKind } from "typedoc";

/**
 * Merger that moves the content of all modules into the project root.
 */
export class ProjectMerger {
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

        if (modules.length > 0) {
            this.project.children = [];

            for (const mod of modules) {
                const reflections = mod.children ?? [];

                for (const ref of reflections) {
                    // Drop aliases
                    if (!ref.kindOf(ReflectionKind.Reference)) {
                        ref.parent = this.project;
                        this.project.children.push(ref);
                    }
                }

                delete mod.children;
                this.project.removeReflection(mod);
            }
        }
    }
}
