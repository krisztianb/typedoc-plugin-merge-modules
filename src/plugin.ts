import {
    Application,
    type Context,
    Converter,
    type DeclarationReflection,
    EntryPointStrategy,
    type ProjectReflection,
    ReflectionKind,
} from "typedoc";
import { ModuleCategoryMerger } from "./merger/module_category_merger.js";
import { ModuleMerger } from "./merger/module_merger.js";
import { ProjectMerger } from "./merger/project_merger.js";
import { PluginOptions } from "./plugin_options.js";
import { tryGetOriginalReflectionName } from "./utils.js";

/**
 * The "Merge Modules" plugin.
 *
 * # What does it do?
 *
 * This plugin merges the content of modules.
 */
export class Plugin {
    /** The options of the plugin. */
    private readonly _options = new PluginOptions();

    /**
     * This is set to "true" if the merging logic of the plugin is executed after TypeDoc
     * has already categorized the DeclarationReflections.
     */
    private _runsAfterCategorization = false;

    /**
     * Returns if the plugin is enabled.
     * @returns True if the plugin is enabled, otherwise false.
     */
    public get isEnabled(): boolean {
        return this._options.mode !== "off";
    }

    /**
     * Returns if the merging logic of the plugin is executed after TypeDoc has categorized the DeclarationReflections.
     * @returns True if the plugin is executed after categorization, otherwise false.
     */
    public get runsAfterCategorization(): boolean {
        return this._runsAfterCategorization;
    }

    /**
     * Initializes the plugin.
     * @param typedoc The TypeDoc application.
     */
    public initialize(typedoc: Readonly<Application>): void {
        this._options.addToApplication(typedoc);
        this.subscribeToApplicationEvents(typedoc);
    }

    /**
     * Subscribes to events of the application so that the plugin can do its work
     * in the particular doc generation phases.
     * @param typedoc The TypeDoc application.
     */
    private subscribeToApplicationEvents(typedoc: Readonly<Application>): void {
        typedoc.on(Application.EVENT_BOOTSTRAP_END, (a: Readonly<Application>) => this.onApplicationBootstrapEnd(a));
        typedoc.converter.on(Converter.EVENT_CREATE_DECLARATION, (c: Readonly<Context>, r: DeclarationReflection) =>
            this.onConverterCreateDeclaration(c, r),
        );

        // When TypeDoc is running with the following entry point strategies, it will create a separate converter
        // and trigger the "Converter.EVENT_RESOLVE_BEGIN" event for each package that it merges into the final
        // ProjectReflection instance.
        // So for these strategies we need to subscribe to an event that is triggered after this merge is complete,
        // in order to be able to access all modules from each package.
        const typeDocUsesMultipleConverters =
            typedoc.entryPointStrategy === EntryPointStrategy.Merge ||
            typedoc.entryPointStrategy === EntryPointStrategy.Packages;

        if (typeDocUsesMultipleConverters) {
            // The "Application.EVENT_PROJECT_REVIVE" event is triggered after the DeclarationReflections have been
            // categorized by TypeDoc.
            this._runsAfterCategorization = true;

            typedoc.on(Application.EVENT_PROJECT_REVIVE, (p: ProjectReflection) => this.onConvertersDone(p));
        } else {
            // The "Converter.EVENT_RESOLVE_BEGIN" event is triggered before the DeclarationReflections have been
            // categorized by TypeDoc.
            this._runsAfterCategorization = false;

            typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (c: Readonly<Context>) =>
                this.onConvertersDone(c.project),
            );
        }
    }

    /**
     * Triggered after plugins have been loaded and options have been read.
     * @param typedoc The TypeDoc application.
     */
    public onApplicationBootstrapEnd(typedoc: Readonly<Application>): void {
        this._options.readValuesFromApplication(typedoc);
    }

    /**
     * Triggered when the converter has created a declaration reflection.
     * @param context Describes the current state the converter is in.
     * @param reflection The reflection that has been created.
     */
    public onConverterCreateDeclaration(context: Readonly<Context>, reflection: DeclarationReflection): void {
        if (
            this.isEnabled &&
            this._options.renameDefaults &&
            reflection.name === "default" &&
            reflection.kindOf(
                ReflectionKind.ClassOrInterface |
                    ReflectionKind.Enum |
                    ReflectionKind.Function |
                    ReflectionKind.TypeAlias |
                    ReflectionKind.TypeLiteral |
                    ReflectionKind.Variable,
            )
        ) {
            const originalName = tryGetOriginalReflectionName(context, reflection);

            if (originalName) {
                reflection.name = originalName;
            }
        }
    }

    /**
     * Triggered after all converters are done.
     * @param project The project on which the event is triggered.
     */
    public onConvertersDone(project: ProjectReflection): void {
        if (this.isEnabled) {
            this.createMerger(project)?.execute();
        }
    }

    /**
     * Creates a merger object for the given project.
     * @param project The project on which the merger should operate.
     * @returns The merger object, or undefined if the plugin is turned off.
     */
    private createMerger(project: ProjectReflection): ProjectMerger | ModuleMerger | undefined {
        if (this._options.mode === "project") {
            return new ProjectMerger(project, this);
        } else if (this._options.mode === "module") {
            return new ModuleMerger(project, this);
        } else if (this._options.mode === "module-category") {
            return new ModuleCategoryMerger(project, this);
        }

        return undefined;
    }
}
