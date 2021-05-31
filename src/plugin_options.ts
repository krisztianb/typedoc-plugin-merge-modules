import { Application, ParameterType } from "typedoc";

type Mode = "project" | "module";

/**
 * Extend typedoc's options with the plugin's option using declaration merging.
 */
declare module "typedoc" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- This is not a separate type.
    export interface TypeDocOptionMap {
        mergeModulesRenameDefaults?: boolean;
        mergeModulesMergeMode?: Mode;
    }
}

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** Defines if the plugin should rename default exports to their original name. */
    private _renameDefaults = true;

    /** Defines if the plugin combine modules into project self or by module name. */
    private _modeDefaults: Mode = "project";

    /**
     * Returns if the plugin should rename default exports to their original name.
     * @returns True, if the plugin should rename default exports to their original name, otherwise false.
     */
    public get renameDefaults(): boolean {
        return this._renameDefaults;
    }

    /**
     * Returns if the plugin combine modules into project self or by module name.
     * @returns 'project', if the plugin combine modules into project self or by module name, otherwise 'module'.
     */
    public get modeDefaults(): Mode {
        return this._modeDefaults;
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
            type: ParameterType.String,
            name: "mergeModulesMergeMode",
            help:
                // eslint-disable-next-line max-len
                "Move all modules into project itself with 'project' ( default ). If 'module' set, modules combined by its name",
            defaultValue: "project",
        });
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param typedoc The TypeDoc application.
     */
    public readValuesFromApplication(typedoc: Readonly<Application>): void {
        this._renameDefaults = typedoc.options.getValue("mergeModulesRenameDefaults") ?? this._renameDefaults;
        this._modeDefaults = typedoc.options.getValue("mergeModulesMergeMode") ?? this._modeDefaults;
    }
}
