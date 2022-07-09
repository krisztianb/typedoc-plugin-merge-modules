import { Context, DeclarationReflection } from "typedoc";
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

            if (declaration && declaration.name && declaration.name.getText) {
                const declarationName = declaration.name.getText();

                if (typeof declarationName === "string") {
                    return declarationName;
                }
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
export function removeTagFromCommentsOf(reflection: DeclarationReflection, tagToRemove: string): void {
    const tagIndex = reflection.comment?.blockTags.findIndex((ct) => ct.tag === tagToRemove) ?? -1;

    if (tagIndex !== -1) {
        reflection.comment?.blockTags.splice(tagIndex, 1);
    }
}
