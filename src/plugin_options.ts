import { Application, ParameterType } from "typedoc";

/** Type for the plugin's mode. */
type Mode = "project" | "module" | "off";

/**
 * Extend typedoc's options with the plugin's option using declaration merging.
 */
declare module "typedoc" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- This is not a separate type.
    export interface TypeDocOptionMap {
        mergeModulesRenameDefaults: boolean;
        mergeModulesMergeMode: Mode;
    }
}

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** Defines if the plugin should rename default exports to their original name. */
    private _renameDefaults = true;

    /** Defines how the plugin should merge modules. */
    private _mode: Mode = "project";

    /**
     * Returns if the plugin should rename default exports to their original name.
     * @returns True, if the plugin should rename default exports to their original name, otherwise false.
     */
    public get renameDefaults(): boolean {
        return this._renameDefaults;
    }

    /**
     * Returns how the plugin should merge modules.
     * @returns How the plugin should merge modules.
     */
    public get mode(): Mode {
        return this._mode;
    }

    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    // eslint-disable-next-line class-methods-use-this
    public addToApplication(typedoc: Readonly<Application>): void {
        typedoc.options.addDeclaration({
            type: ParameterType.Boolean,
            name: "mergeModulesRenameDefaults",
            help: "If true default exports are renamed to their original name as their module is merged.",
            defaultValue: true,
        });

        typedoc.options.addDeclaration({
            type: ParameterType.Map,
            map: new Map([
                ["project", "project"],
                ["module", "module"],
                ["off", "off"],
            ]),
            name: "mergeModulesMergeMode",
            help: "Defines how the plugin should merge modules.",
            defaultValue: "project",
        });
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param typedoc The TypeDoc application.
     */
    public readValuesFromApplication(typedoc: Readonly<Application>): void {
        this._renameDefaults = typedoc.options.getValue("mergeModulesRenameDefaults");
        this._mode = typedoc.options.getValue("mergeModulesMergeMode");
    }
}
