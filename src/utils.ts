import {
    type CommentTag,
    type Context,
    DeclarationReflection,
    type DocumentReflection,
    ProjectReflection,
    ReflectionGroup,
    ReflectionKind,
} from "typedoc";
import type * as ts from "typescript";

/**
 * Type extending the TypeScript Declaration interface with a possible identifier object as a name.
 */
type DeclarationWithIdentifier = ts.Declaration & {
    name?: {
        getText?(): unknown;
    };
};

/**
 * Tries to determine the original name of a reflection.
 * @param context The TypeDoc context.
 * @param reflection The reflection whose original name is wanted.
 * @returns The original name of the reflection or undefined if it could not be determined.
 */
export function tryGetOriginalReflectionName(
    context: Readonly<Context>,
    reflection: DeclarationReflection,
): string | undefined {
    const symbol = context.getSymbolFromReflection(reflection);

    if (symbol) {
        if (symbol.name && symbol.name !== "default") {
            return symbol.name;
        } else if (symbol.declarations) {
            const declaration = symbol.declarations[0] as DeclarationWithIdentifier | undefined;
            const declarationName = declaration?.name?.getText?.();

            if (typeof declarationName === "string") {
                return declarationName;
            }
        }
    }

    return undefined;
}

/**
 * Removes a possible tag from the comments of the given reflection.
 * @param reflection The reflection from which the tag should be removed.
 * @param tagToRemove Name of the tag to be removed.
 */
export function removeTagFromCommentsOf(
    reflection: DeclarationReflection | ProjectReflection,
    tagToRemove: string,
): void {
    const tagIndex = reflection.comment?.blockTags.findIndex((ct) => ct.tag === tagToRemove) ?? -1;

    if (tagIndex !== -1) {
        reflection.comment?.blockTags.splice(tagIndex, 1);
    }
}

/**
 * Removes the given reflection from the given group.
 * @param ref The reflection that should be removed from the group.
 * @param group The group from which the reflection should be removed.
 */
export function removeReflectionFromGroup(
    ref: DeclarationReflection | DocumentReflection,
    group: ReflectionGroup,
): void {
    const indexInGroup = group.children.indexOf(ref);
    if (indexInGroup !== -1) {
        group.children.splice(indexInGroup, 1);
    }
}

/**
 * Adds the given reflection to the given target.
 * @param ref The reflection which should be added to the target.
 * @param target The target to which to add the reflection.
 */
export function addReflectionToTarget(
    ref: DeclarationReflection | DocumentReflection,
    target: ProjectReflection | DeclarationReflection,
): void {
    ref.parent = target;
    target.addChild(ref);
}

/**
 * Removes the given reflection from its parent.
 * @param ref The reflection which should be removed from its parent.
 */
export function removeReflectionFromParent(ref: DeclarationReflection | DocumentReflection): void {
    const parent = ref.parent;

    if (parent instanceof DeclarationReflection || parent instanceof ProjectReflection) {
        parent.removeChild(ref);

        // If the parent has a group called "Modules", remove the reflection from that group as well. (GH-23)
        const modulesGroup = parent.groups?.find((g) => g.title === "Modules");
        if (modulesGroup) {
            removeReflectionFromGroup(ref, modulesGroup);
        }
    }
}

/**
 * Moves a reflection to the given target.
 * @param ref The reflection that should be moved.
 * @param target The target into which the reflection should be moved.
 */
export function moveReflectionToTarget(
    ref: DeclarationReflection | DocumentReflection,
    target: DeclarationReflection | ProjectReflection,
): void {
    removeReflectionFromParent(ref);
    addReflectionToTarget(ref, target);
}

/**
 * Returns the modules within the given module parent. Searches recursively.
 * @param moduleParent The element in which to search for modules.
 * @returns The modules within the given module parent.
 */
export function getModulesFrom(moduleParent: ProjectReflection | DeclarationReflection): DeclarationReflection[] {
    const modules = (moduleParent.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));

    for (const mod of modules) {
        const subModules = getModulesFrom(mod);
        modules.push(...subModules);
    }

    return modules;
}

/**
 * Returns the first line of the given string.
 * @param text The string from which to read the first line.
 * @returns The first line of the given string.
 */
function getFirstLineOf(text: string): string {
    return text.split("\n", 1)[0];
}

/**
 * Returns the name of the given description tag.
 * @param tag The description tag.
 * @returns The name of the given description tag.
 */
export function getNameFromDescriptionTag(tag: CommentTag): string {
    return getFirstLineOf(tag.content[0]?.text ?? "");
}
