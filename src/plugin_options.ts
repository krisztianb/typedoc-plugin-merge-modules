import { Application, ParameterType } from "typedoc";

/**
 * Extend typedoc's options with the plugin's option using declaration merging.
 */
declare module "typedoc" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- This is not a separate type.
    export interface TypeDocOptionMap {
        "replace-in-comments-config"?: ReplaceInfoFromConfig[];
    }
}

/**
 * A type describing what should be replaced by what as it is defined by the user in the config.
 */
type ReplaceInfoFromConfig = {
    /** The regular expression pattern used to find the text that should be replaced. */
    pattern: string;

    /** Flags for the regular expression pattern. */
    flags?: string;

    /** The text that should be used as a replacement. */
    replace: string;
};

/**
 * A type describing what should be replaced by what using a regular expression.
 */
type ReplaceInfoWithRegex = {
    /** The regular expression object used to find the text that should be replaced. */
    regex: RegExp;

    /** The text that should be used as a replacement. */
    replace: string;
};

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** The replace information. */
    private _replacements: ReplaceInfoWithRegex[] = [];

    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    // eslint-disable-next-line class-methods-use-this
    public addToApplication(typedoc: Readonly<Application>): void {
        typedoc.options.addDeclaration({
            type: ParameterType.Mixed,
            name: "replace-in-comments-config",
            help: "The array with the objects defining the replacement patterns.",
            defaultValue: [],
        });
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param typedoc The TypeDoc application.
     */
    public readValuesFromApplication(typedoc: Readonly<Application>): void {
        const config = typedoc.options.getValue("replace-in-comments-config");

        // Convert patterns and flags to regular expressions and cache them
        if (config) {
            this._replacements = config.map((x) => {
                return { regex: new RegExp(x.pattern, x.flags ?? "g"), replace: x.replace };
            });
        }
    }

    /**
     * Returns the replace information.
     * @returns The replace information.
     */
    public get replacements(): ReplaceInfoWithRegex[] {
        return this._replacements;
    }
}
