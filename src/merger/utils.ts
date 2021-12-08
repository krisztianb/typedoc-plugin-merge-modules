import { DeclarationReflection } from "typedoc";

/**
 * Removes a possible tag from the comments of the given reflection.
 * @param reflection The reflection from which the tag should be removed.
 * @param tagToRemove Name of the tag to be removed.
 */
export function removeTagFromCommentsOf(reflection: DeclarationReflection, tagToRemove: string): void {
    tagToRemove = tagToRemove.toLowerCase();

    const tagIndex = reflection.comment?.tags.findIndex((tag) => tag.tagName.toLowerCase() === tagToRemove) ?? -1;

    if (tagIndex !== -1) {
        reflection.comment?.tags.splice(tagIndex, 1);
    }
}
