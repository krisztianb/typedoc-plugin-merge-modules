/** @module merger */
import { Comment, DeclarationReflection, DocumentReflection, ProjectReflection, ReflectionKind } from "typedoc";
import {
    addDeclarationReflectionToTarget,
    addDocumentReflectionToTarget,
    getNameFromDescriptionTag,
    removeDeclarationReflectionFromModule,
    removeDocumentReflectionFromModule,
    removeTagFromCommentsOf,
} from "../utils";

/**
 * Name of the comment tag that can be used to mark a module as the target module within the bundle.
 * The target module is the one into which all the modules of the bundle are merged.
 */
const targetModuleCommentTag = "@mergeTarget";

/**
 * Class representing a group of modules.
 */
export class ModuleBundle {
    /** The project in which all modules are in. */
    private readonly project: ProjectReflection;

    /** The modules of the bundle. */
    private readonly modules = new Array<DeclarationReflection>();

    /**
     * Creates a new module bundle instance.
     * @param project The project in which all modules are in.
     */
    public constructor(project: ProjectReflection) {
        this.project = project;
    }

    /**
     * Adds a module to the bundle.
     * @param module The module to add.
     */
    public add(module: DeclarationReflection): void {
        this.modules.push(module);
    }

    /**
     * Merges the modules of the bundle into one module.
     * @param categorizationHasAlreadyHappened Defines if TypeDoc has already categorized the
     *                                         reflections in the modules of the bundle.
     */
    public merge(categorizationHasAlreadyHappened: boolean): void {
        // get target module
        const targetModule = this.getTargetModule();
        removeTagFromCommentsOf(targetModule, targetModuleCommentTag);

        this.mergeChildrenAndDocumentsIntoTargetModule(targetModule);

        if (categorizationHasAlreadyHappened) {
            // In this case TypeDoc has already categorized and grouped the reflections.
            // Therefore we must merge the content all categories and groups into the target module.
            this.mergeCategoriesIntoTargetModule(targetModule);
            this.mergeGroupsIntoTargetModule(targetModule);
        } else {
            // In this case we must copy the category descriptions into the target module because TypeDoc will look
            // for them there when it categorizes and groups the reflections.
            // If we don't do this then the category and group descriptions would be missing in the docs.
            this.copyCategoryDescriptionTagsIntoTargetModule(targetModule);
            this.copyGroupDescriptionTagsIntoTargetModule(targetModule);
        }

        // remove rest modules
        this.modules.forEach((module) => {
            if (module !== targetModule) {
                delete module.children;
                this.project.removeReflection(module);
            }
        });
    }

    /**
     * Returns the module from the bundle that should be used as the target module.
     * @returns The target module.
     */
    private getTargetModule(): DeclarationReflection {
        // 1. search for the first module which is marked with a specific tag
        const firstModuleWithTargetTag = this.modules.find(
            (module) =>
                module.comment && module.comment.blockTags.findIndex((ct) => ct.tag === targetModuleCommentTag) !== -1,
        );

        if (firstModuleWithTargetTag) {
            return firstModuleWithTargetTag;
        }

        // 2. search for the first module with a comment
        const firstModuleWithComment = this.modules.find((module) => (module.comment?.summary.length ?? 0) > 0);

        if (firstModuleWithComment) {
            return firstModuleWithComment;
        }

        // 3. default: pick the first module
        return this.modules[0];
    }

    private mergeChildrenAndDocumentsIntoTargetModule(targetModule: DeclarationReflection): void {
        for (const mod of this.modules) {
            // Here we create a copy because the next loop modifies the collection
            const reflections = [...(mod.childrenIncludingDocuments ?? [])];

            for (const ref of reflections) {
                // Drop aliases (= ReflectionKind.Reference)
                if (ref instanceof DeclarationReflection && !ref.kindOf(ReflectionKind.Reference)) {
                    this.moveDeclarationReflectionToTargetModule(ref, targetModule);
                } else if (ref instanceof DocumentReflection) {
                    this.moveDocumentReflectionToTargetModule(ref, targetModule);
                }
            }
        }
    }

    /**
     * Moves a declaration reflection to the given target module.
     * @param ref The declaration reflection that should be moved.
     * @param targetModule The target module into which the declaration reflection should be moved.
     */
    // eslint-disable-next-line class-methods-use-this
    private moveDeclarationReflectionToTargetModule(
        ref: DeclarationReflection,
        targetModule: DeclarationReflection,
    ): void {
        removeDeclarationReflectionFromModule(ref);
        addDeclarationReflectionToTarget(ref, targetModule);
    }

    /**
     * Moves a document reflection to the given target module.
     * @param ref The document reflection that should be moved.
     * @param targetModule The target module into which the document reflection should be moved.
     * @throws {Error} If the given reflection is not within a module.
     */
    // eslint-disable-next-line class-methods-use-this
    private moveDocumentReflectionToTargetModule(ref: DocumentReflection, targetModule: DeclarationReflection): void {
        removeDocumentReflectionFromModule(ref);
        addDocumentReflectionToTarget(ref, targetModule);
    }

    /**
     * Merges the children from all modules' categories into the corresponding category of the given target module.
     * @param targetModule The target module into whoes categories the children should be merged.
     */
    private mergeCategoriesIntoTargetModule(targetModule: DeclarationReflection): void {
        // merge categories
        this.modules.forEach((module) => {
            if (module !== targetModule) {
                module.categories?.forEach((category) => {
                    const existingTargetCategory = targetModule.categories?.find((c) => c.title === category.title);

                    if (!existingTargetCategory) {
                        targetModule.categories = [...(targetModule.categories ?? []), category];
                    } else {
                        existingTargetCategory.children = existingTargetCategory.children.concat(category.children);

                        if (existingTargetCategory.description?.length === 0 && category.description) {
                            existingTargetCategory.description = category.description;
                        }
                    }
                });
            }
        });

        // sort categories
        targetModule.categories?.forEach((category) => {
            category.children.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name === b.name) {
                    return 0;
                }
                return -1;
            });
        });
    }
    /**
     * Copies the category description comment tags into the the given target module.
     * @param targetModule The target module into which the category descriptions are merged.
     */
    private copyCategoryDescriptionTagsIntoTargetModule(targetModule: DeclarationReflection): void {
        this.modules.forEach((module) => {
            if (module !== targetModule) {
                const categoryDescriptionsOfModule =
                    module.comment?.blockTags.filter((bt) => bt.tag === "@categoryDescription") ?? [];

                if (categoryDescriptionsOfModule.length === 0) {
                    return; // nothing to copy
                }

                if (!targetModule.comment) {
                    targetModule.comment = new Comment([], []);
                }

                categoryDescriptionsOfModule.forEach((categoryDescription) => {
                    const targetModuleAlreadyHasThisCategoryDescriptionsTag = targetModule.comment?.blockTags.find(
                        (bt) =>
                            bt.tag === "@categoryDescription" &&
                            getNameFromDescriptionTag(bt) === getNameFromDescriptionTag(categoryDescription),
                    );

                    if (!targetModuleAlreadyHasThisCategoryDescriptionsTag) {
                        targetModule.comment?.blockTags.push(categoryDescription);
                    }
                });
            }
        });
    }

    /**
     * Merges the children from all modules' groups into the corresponding group of the given target module.
     * @param targetModule The target module into whoes groups the children should be merged.
     */
    private mergeGroupsIntoTargetModule(targetModule: DeclarationReflection): void {
        // merge groups
        this.modules.forEach((module) => {
            if (module !== targetModule) {
                module.groups?.forEach((group) => {
                    const existingTargetGroup = targetModule.groups?.find((g) => g.title === group.title);

                    if (!existingTargetGroup) {
                        targetModule.groups = [...(targetModule.groups ?? []), group];
                    } else {
                        existingTargetGroup.children = existingTargetGroup.children.concat(group.children);

                        if (existingTargetGroup.description?.length === 0 && group.description) {
                            existingTargetGroup.description = group.description;
                        }
                    }
                });
            }
        });

        // sort groups
        targetModule.groups?.forEach((group) => {
            group.children.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name === b.name) {
                    return 0;
                }
                return -1;
            });
        });
    }

    /**
     * Copies the group description comment tags into the the given target module.
     * @param targetModule The target module into which the group descriptions are merged.
     */
    private copyGroupDescriptionTagsIntoTargetModule(targetModule: DeclarationReflection): void {
        this.modules.forEach((module) => {
            if (module !== targetModule) {
                const groupDescriptionsOfModule =
                    module.comment?.blockTags.filter((bt) => bt.tag === "@groupDescription") ?? [];

                if (groupDescriptionsOfModule.length === 0) {
                    return; // nothing to copy
                }

                if (!targetModule.comment) {
                    targetModule.comment = new Comment([], []);
                }

                groupDescriptionsOfModule.forEach((groupDescription) => {
                    const targetModuleAlreadyHasThisGroupDescriptionsTag = targetModule.comment?.blockTags.find(
                        (bt) =>
                            bt.tag === "@groupDescription" &&
                            getNameFromDescriptionTag(bt) === getNameFromDescriptionTag(groupDescription),
                    );

                    if (!targetModuleAlreadyHasThisGroupDescriptionsTag) {
                        targetModule.comment?.blockTags.push(groupDescription);
                    }
                });
            }
        });
    }
}
