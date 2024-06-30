/** @module merger */
import { DeclarationReflection, DocumentReflection, ProjectReflection, ReflectionKind } from "typedoc";
import {
    addDeclarationReflectionToTarget,
    addDocumentReflectionToTarget,
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
        const modules = (this.project.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));

        if (modules.length > 0) {
            this.clearProject();

            for (const mod of modules) {
                // Here we create a copy because the next loop modifies the collection
                const reflections = [...(mod.childrenIncludingDocuments ?? [])];

                for (const ref of reflections) {
                    // Drop aliases (= ReflectionKind.Reference)
                    if (ref instanceof DeclarationReflection && !ref.kindOf(ReflectionKind.Reference)) {
                        this.moveDeclarationReflectionToProject(ref);
                    } else if (ref instanceof DocumentReflection) {
                        this.moveDocumentReflectionFromToProject(ref);
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
