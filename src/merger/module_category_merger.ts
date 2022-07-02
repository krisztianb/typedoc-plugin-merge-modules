import { DeclarationReflection } from "typedoc";
import { ModuleMerger } from "./module_merger";

/**
 * Merger that merges the content of modules based on their JSDoc module annotation and category.
 */
export class ModuleCategoryMerger extends ModuleMerger {
    /**
     * Creates an identifier for the module's bundle.
     * @param module The module for which the identifier is generated.
     * @returns The identifier for the module's bundle.
     */
    // eslint-disable-next-line class-methods-use-this
    protected override createModuleBundleId(module: DeclarationReflection): string {
        const categoryTags = module.comment?.blockTags.filter((ct) => ct.tag === "@category") ?? [];
        const categoryTagTexts = categoryTags.map((ct) => ct.content.map((c) => c.text).join()).sort();
        return module.name + "_[[[CATEGORIES:]]]_" + categoryTagTexts.join("_[[[|]]]_");
    }
}
