import { Application, DeclarationReflection, Reflection, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import * as ts from "typescript";
import { PluginOptions } from "./plugin_options";

/**
 * The "Merge Modules" plugin.
 *
 * # What does it do?
 *
 * This plugin merges the content of all modules into the project itself.
 */
export class Plugin {
    /** The options of the plugin. */
    private readonly options = new PluginOptions();

    /**
     * Initializes the plugin.
     * @param typedoc The TypeDoc application.
     */
    public initialize(typedoc: Readonly<Application>): void {
        this.options.addToApplication(typedoc);
        this.subscribeToApplicationEvents(typedoc);
    }

    /**
     * Subscribes to events of the application so that the plugin can do its work
     * in the particular doc generation phases.
     * @param typedoc The TypeDoc application.
     */
    private subscribeToApplicationEvents(typedoc: Readonly<Application>): void {
        typedoc.converter.on(Converter.EVENT_BEGIN, (c: Readonly<Context>) => this.onConverterBegin(c));
        typedoc.converter.on(
            Converter.EVENT_CREATE_DECLARATION,
            (c: Readonly<Context>, r: Reflection, n?: Readonly<ts.Node>) => this.onConverterCreateDeclaration(c, r, n),
        );
        typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (c: Readonly<Context>) => this.onConverterResolveBegin(c));
    }

    /**
     * Triggered when the converter begins converting a project.
     * @param context Describes the current state the converter is in.
     */
    public onConverterBegin(context: Readonly<Context>): void {
        this.options.readValuesFromApplication(context.converter.owner.application);
    }

    /**
     * Triggered when the converter has created a declaration reflection.
     * @param _context Describes the current state the converter is in.
     * @param reflection The reflection that has been created.
     * @param node The triggering TypeScript node if available.
     */
    public onConverterCreateDeclaration(
        _context: Readonly<Context>,
        reflection: Reflection,
        node?: Readonly<ts.Node>,
    ): void {
        if (
            this.options.renameDefaults &&
            reflection.name === "default" &&
            node &&
            (ts.isVariableDeclaration(node) || ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) &&
            node.name
        ) {
            reflection.name = node.name.getText();
        }
    }

    /**
     * Triggered when the TypeDoc converter begins resolving a project.
     * @param context Describes the current state the converter is in.
     */
    // eslint-disable-next-line class-methods-use-this
    public onConverterResolveBegin(context: Readonly<Context>): void {
        const project = context.project;
        const modules = (project.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));

        // conbine module DeclarationReflection by its module name
        const combinedModules: Record<string, DeclarationReflection[]> = {};
        modules.forEach((module) =>
            combinedModules[module.name]
                ? combinedModules[module.name].push(module)
                : (combinedModules[module.name] = [module]),
        );

        // reduce multiple DeclarationReflection into single declaration
        for (const modName in combinedModules) {
            const mods = combinedModules[modName];
            const children = mods
                .map((m) => m.children)
                .reduce((acc, val) => (val ? (acc || []).concat(val) : acc), []);
            // use first module as a principle module
            mods[0].children = children;
            // remove rest modules
            for (let i = 1; i < mods.length; i++) {
                mods[i].children = undefined;
                project.removeReflection(mods[i]);
            }
        }

        /*
        if (modules.length > 0) {
            project.children = [];

            for (const mod of modules) {
                const reflections = mod.children ?? [];

                for (const ref of reflections) {
                    // Drop aliases
                    if (!ref.kindOf(ReflectionKind.Reference)) {
                        ref.parent = project;
                        project.children.push(ref);
                    }
                }

                mod.children = undefined;
                project.removeReflection(mod);
            }
        }
        */
    }
}
