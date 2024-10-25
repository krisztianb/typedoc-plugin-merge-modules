import {
    CommentTag,
    Context,
    DeclarationReflection,
    DocumentReflection,
    ProjectReflection,
    ReflectionKind,
} from "typedoc";
import * as ts from "typescript";

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
    const symbol = context.project.getSymbolFromReflection(reflection);

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
 * Adds the given declaration reflection to the given target.
 * @param ref The declaration reflection which should be added to the target.
 * @param target The target to which to add the declaration reflection.
 */
export function addDeclarationReflectionToTarget(
    ref: DeclarationReflection,
    target: ProjectReflection | DeclarationReflection,
): void {
    ref.parent = target;
    target.children?.push(ref);
    target.childrenIncludingDocuments?.push(ref);
}

/**
 * Removes the given declaration reflection from its module.
 * @param ref The declaration reflection which should be removed from its module.
 * @throws {Error} If the given reflection is not within a module.
 */
export function removeDeclarationReflectionFromModule(ref: DeclarationReflection): void {
    const module = ref.parent;

    if (!(module instanceof DeclarationReflection)) {
        throw new Error("Trying to move a declaration reflection that is not part of a module");
    }

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
 * Adds the given document reflection to the given target.
 * @param ref The document reflection which should be added to the target.
 * @param target The target to which to add the document reflection.
 */
export function addDocumentReflectionToTarget(
    ref: DocumentReflection,
    target: ProjectReflection | DeclarationReflection,
): void {
    ref.parent = target;
    target.documents?.push(ref);
    target.childrenIncludingDocuments?.push(ref);
}

/**
 * Removes the given document reflection from its module.
 * @param ref The document reflection which should be removed from its module.
 * @throws {Error} If the given reflection is not within a module.
 */
export function removeDocumentReflectionFromModule(ref: DocumentReflection): void {
    const module = ref.parent;

    if (!(module instanceof DeclarationReflection)) {
        throw new Error("Trying to move a document reflection that is not part of a module");
    }

    const indexInDocuments = module.documents?.indexOf(ref) ?? -1;
    if (indexInDocuments !== -1) {
        module.documents?.splice(indexInDocuments, 1);
    }

    const indexInChildrenIncludingDocuments = module.childrenIncludingDocuments?.indexOf(ref) ?? -1;
    if (indexInChildrenIncludingDocuments !== -1) {
        module.childrenIncludingDocuments?.splice(indexInChildrenIncludingDocuments, 1);
    }
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
