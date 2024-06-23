/** @module merger */
import { DeclarationReflection, DocumentReflection, ProjectReflection, ReflectionKind } from "typedoc";

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
            this.clearProject();

            for (const mod of modules) {
                const reflections = mod.childrenIncludingDocuments ?? [];

                for (const ref of reflections) {
                    // Drop aliases (= ReflectionKind.Reference)
                    if (ref instanceof DeclarationReflection && !ref.kindOf(ReflectionKind.Reference)) {
                        this.moveDeclarationReflectionFromModuleToProject(ref, mod);
                    } else if (ref instanceof DocumentReflection) {
                        this.moveDocumentReflectionFromModuleToProject(ref, mod);
                    }
                }
            }
        }
    }

    /**
     * Removes all children and documents from the project reflection.
     */
    private clearProject(): void {
        this.project.children = [];
        this.project.documents = [];
        this.project.childrenIncludingDocuments = [];
        this.project.children.forEach((child) => this.project.removeReflection(child));
    }

    /**
     * Moves a declaration reflection from a module to the project root.
     * @param ref The declaration reflection that should be moved.
     * @param module The module into which to move the declaration reflection.
     */
    private moveDeclarationReflectionFromModuleToProject(
        ref: DeclarationReflection,
        module: DeclarationReflection,
    ): void {
        // add to project
        ref.parent = this.project;
        this.project.children?.push(ref);
        this.project.childrenIncludingDocuments?.push(ref);

        // remove from module
        const indexInChildren = module.children?.indexOf(ref) ?? -1;
        if (indexInChildren !== -1) {
            module.children?.splice(indexInChildren, 1);
        }

        const indexInChildrenIncludingDocuments = module.childrenIncludingDocuments?.indexOf(ref) ?? -1;
        if (indexInChildrenIncludingDocuments !== -1) {
            module.childrenIncludingDocuments?.splice(indexInChildrenIncludingDocuments, 1);
        }
    }

    /**
     * Moves a document reflection from a module to the project root.
     * @param ref The document reflection that should be moved.
     * @param module The module into which to move the document reflection.
     */
    private moveDocumentReflectionFromModuleToProject(ref: DocumentReflection, module: DeclarationReflection): void {
        // add to project
        ref.parent = this.project;
        this.project.documents?.push(ref);
        this.project.childrenIncludingDocuments?.push(ref);

        // remove from module
        const indexInDocuments = module.documents?.indexOf(ref) ?? -1;
        if (indexInDocuments !== -1) {
            module.documents?.splice(indexInDocuments, 1);
        }

        const indexInChildrenIncludingDocuments = module.childrenIncludingDocuments?.indexOf(ref) ?? -1;
        if (indexInChildrenIncludingDocuments !== -1) {
            module.childrenIncludingDocuments?.splice(indexInChildrenIncludingDocuments, 1);
        }
    }
}
