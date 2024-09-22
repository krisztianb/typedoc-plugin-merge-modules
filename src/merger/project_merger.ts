import { DeclarationReflection, DocumentReflection, ProjectReflection, ReflectionKind } from "typedoc";
import {
    addDeclarationReflectionToTarget,
    addDocumentReflectionToTarget,
    getModulesFrom,
    removeDeclarationReflectionFromModule,
    removeDocumentReflectionFromModule,
} from "../utils";

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
        // In monorepo project each project is also a module => Recursively collect all modules
        const allModules = getModulesFrom(this.project);

        if (allModules.length > 0) {
            this.removeModulesFromProject();

            for (const module of allModules) {
                // Here we create a copy because the next loop modifies the collection
                const reflections = [...(module.childrenIncludingDocuments ?? [])];

                for (const ref of reflections) {
                    // Drop aliases (= ReflectionKind.Reference) and modules
                    if (
                        ref instanceof DeclarationReflection &&
                        !ref.kindOf([ReflectionKind.Reference, ReflectionKind.Module])
                    ) {
                        this.moveDeclarationReflectionToProject(ref);
                    } else if (ref instanceof DocumentReflection) {
                        this.moveDocumentReflectionFromToProject(ref);
                    }
                }
            }
        }
    }

    /**
     * Removes all modules from the project reflection. Doesn't touch the project documents.
     */
    private removeModulesFromProject(): void {
        this.project.children = [];
        this.project.children.forEach((child) => this.project.removeReflection(child));

        // keep project documents that are included with the TypeDoc config parameter "projectDocuments"
        this.project.childrenIncludingDocuments =
            this.project.childrenIncludingDocuments?.filter((item) => item instanceof DocumentReflection) ?? [];
    }

    /**
     * Moves a declaration reflection to the project root.
     * @param ref The declaration reflection that should be moved.
     */
    private moveDeclarationReflectionToProject(ref: DeclarationReflection): void {
        removeDeclarationReflectionFromModule(ref);
        addDeclarationReflectionToTarget(ref, this.project);
    }

    /**
     * Moves a document reflection to the project root.
     * @param ref The document reflection that should be moved.
     * @throws {Error} If the given reflection is not within a module.
     */
    private moveDocumentReflectionFromToProject(ref: DocumentReflection): void {
        removeDocumentReflectionFromModule(ref);
        addDocumentReflectionToTarget(ref, this.project);
    }
}
