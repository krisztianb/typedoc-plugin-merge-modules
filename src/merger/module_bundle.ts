import { Comment, DeclarationReflection, DocumentReflection, type ProjectReflection, ReflectionKind } from "typedoc";
import {
    getNameFromDescriptionTag,
    moveReflectionToTarget,
    removeReflectionFromParent,
    removeTagFromCommentsOf,
} from "../utils.js";

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
     * Merges the modules of the bundle into one module (or the given target override).
     * @param categorizationHasAlreadyHappened Defines if TypeDoc has already categorized the
     *                                         reflections in the modules of the bundle.
     * @param targetOverride A module to target, taking precendence over the bundle's search.
     */
    public merge(
        categorizationHasAlreadyHappened: boolean,
        targetOverride?: DeclarationReflection | ProjectReflection,
    ): void {
        // get target module
        const mergeTarget = targetOverride ?? this.getTargetModule();
        removeTagFromCommentsOf(mergeTarget, targetModuleCommentTag);

        this.moveChildrenAndDocumentsIntoTarget(mergeTarget);

        if (categorizationHasAlreadyHappened) {
            // In this case TypeDoc has already categorized and grouped the reflections.
            // Therefore we must copy the content of all categories and groups into the target.
            this.moveCategoriesIntoTarget(mergeTarget);
            this.moveGroupsIntoTarget(mergeTarget);
        } else {
            // In this case we must copy the category descriptions into the target because TypeDoc will look
            // for them there when it categorizes and groups the reflections.
            // If we don't do this then the category and group descriptions will be missing in the docs.
            this.copyCategoryDescriptionTagsIntoTarget(mergeTarget);
            this.copyGroupDescriptionTagsIntoTarget(mergeTarget);
        }

        // remove rest modules
        this.modules.forEach((module) => {
            if (module !== mergeTarget) {
                removeReflectionFromParent(module);
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

    /**
     * Moves all children and documents into the given target.
     * @param target The target into which the children and documents should be moved.
     */
    private moveChildrenAndDocumentsIntoTarget(target: DeclarationReflection | ProjectReflection): void {
        for (const mod of this.modules) {
            // Here we create a copy because the next loop modifies the collection
            const reflections = [...(mod.childrenIncludingDocuments ?? [])];

            for (const ref of reflections) {
                // Drop aliases (= ReflectionKind.Reference)
                if (
                    (ref instanceof DeclarationReflection && !ref.kindOf(ReflectionKind.Reference)) ||
                    ref instanceof DocumentReflection
                ) {
                    moveReflectionToTarget(ref, target);
                }
            }
        }
    }

    /**
     * Moves the children from all modules' categories into the corresponding category of the given target.
     * @param target The target into whose categories the children should be moved.
     */
    private moveCategoriesIntoTarget(target: DeclarationReflection | ProjectReflection): void {
        // move categories
        this.modules.forEach((module) => {
            if (module !== target) {
                module.categories?.forEach((category) => {
                    const existingTargetCategory = target.categories?.find((c) => c.title === category.title);

                    if (!existingTargetCategory) {
                        target.categories = [...(target.categories ?? []), category];
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
        target.categories?.forEach((category) => {
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
     * Copies the category description comment tags into the the given target.
     * @param target The target into which the category descriptions are copied.
     */
    private copyCategoryDescriptionTagsIntoTarget(target: DeclarationReflection | ProjectReflection): void {
        this.modules.forEach((module) => {
            if (module !== target) {
                const categoryDescriptionsOfModule =
                    module.comment?.blockTags.filter((bt) => bt.tag === "@categoryDescription") ?? [];

                if (categoryDescriptionsOfModule.length === 0) {
                    return; // nothing to copy
                }

                if (!target.comment) {
                    target.comment = new Comment([], []);
                }

                categoryDescriptionsOfModule.forEach((categoryDescription) => {
                    const targetModuleAlreadyHasThisCategoryDescriptionsTag = target.comment?.blockTags.find(
                        (bt) =>
                            bt.tag === "@categoryDescription" &&
                            getNameFromDescriptionTag(bt) === getNameFromDescriptionTag(categoryDescription),
                    );

                    if (!targetModuleAlreadyHasThisCategoryDescriptionsTag) {
                        target.comment?.blockTags.push(categoryDescription);
                    }
                });
            }
        });
    }

    /**
     * Moves the children from all modules' groups into the corresponding group of the given target.
     * @param target The target into whose groups the children should be moved.
     */
    private moveGroupsIntoTarget(target: DeclarationReflection | ProjectReflection): void {
        // move groups
        this.modules.forEach((module) => {
            if (module !== target) {
                module.groups?.forEach((group) => {
                    const existingTargetGroup = target.groups?.find((g) => g.title === group.title);

                    if (!existingTargetGroup) {
                        target.groups = [...(target.groups ?? []), group];
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
        target.groups?.forEach((group) => {
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
     * Copies the group description comment tags into the the given target.
     * @param target The target into which the group descriptions are copied.
     */
    private copyGroupDescriptionTagsIntoTarget(target: DeclarationReflection | ProjectReflection): void {
        this.modules.forEach((module) => {
            if (module !== target) {
                const groupDescriptionsOfModule =
                    module.comment?.blockTags.filter((bt) => bt.tag === "@groupDescription") ?? [];

                if (groupDescriptionsOfModule.length === 0) {
                    return; // nothing to copy
                }

                if (!target.comment) {
                    target.comment = new Comment([], []);
                }

                groupDescriptionsOfModule.forEach((groupDescription) => {
                    const targetModuleAlreadyHasThisGroupDescriptionsTag = target.comment?.blockTags.find(
                        (bt) =>
                            bt.tag === "@groupDescription" &&
                            getNameFromDescriptionTag(bt) === getNameFromDescriptionTag(groupDescription),
                    );

                    if (!targetModuleAlreadyHasThisGroupDescriptionsTag) {
                        target.comment?.blockTags.push(groupDescription);
                    }
                });
            }
        });
    }
}
