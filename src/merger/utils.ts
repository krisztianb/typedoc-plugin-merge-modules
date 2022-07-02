import { DeclarationReflection } from "typedoc";

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
