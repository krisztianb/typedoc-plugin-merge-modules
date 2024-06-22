import {
    Application,
    Context,
    Converter,
    DeclarationReflection,
    EntryPointStrategy,
    ProjectReflection,
    ReflectionKind,
} from "typedoc";
import { ModuleCategoryMerger } from "./merger/module_category_merger";
import { ModuleMerger } from "./merger/module_merger";
import { ProjectMerger } from "./merger/project_merger";
import { PluginOptions } from "./plugin_options";
import { tryGetOriginalReflectionName } from "./utils";

/**
 * The "Merge Modules" plugin.
 *
 * # What does it do?
 *
 * This plugin merges the content of modules.
 */
export class Plugin {
    /** The options of the plugin. */
    private readonly options = new PluginOptions();

    /**
     * Returns if the plugin is enabled.
     * @returns True if the plugin is enabled, otherwise false.
     */
    public get isEnabled(): boolean {
        return this.options.mode !== "off";
    }

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
        typedoc.on(Application.EVENT_BOOTSTRAP_END, (a: Readonly<Application>) => this.onApplicationBootstrapEnd(a));
        typedoc.converter.on(Converter.EVENT_CREATE_DECLARATION, (c: Readonly<Context>, r: DeclarationReflection) =>
            this.onConverterCreateDeclaration(c, r),
        );

        // When TypeDoc is running with the following entry point strategies, it will create a separate converter
        // and trigger the "Converter.EVENT_RESOLVE_BEGIN" event for each package that it merges.
        // So for these strategies we need to subscribe to an event that is triggered after this merge is complete.
        const typeDocUsesMultipleConverters =
            typedoc.entryPointStrategy === EntryPointStrategy.Merge ||
            typedoc.entryPointStrategy === EntryPointStrategy.Packages;

        if (typeDocUsesMultipleConverters) {
            typedoc.on(Application.EVENT_PROJECT_REVIVE, (p: ProjectReflection) => this.onConvertersDone(p));
        } else {
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
        this.options.readValuesFromApplication(typedoc);
    }

    /**
     * Triggered when the converter has created a declaration reflection.
     * @param context Describes the current state the converter is in.
     * @param reflection The reflection that has been created.
     */
    public onConverterCreateDeclaration(context: Readonly<Context>, reflection: DeclarationReflection): void {
        if (
            this.isEnabled &&
            this.options.renameDefaults &&
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
        if (this.options.mode === "project") {
            return new ProjectMerger(project);
        } else if (this.options.mode === "module") {
            return new ModuleMerger(project);
        } else if (this.options.mode === "module-category") {
            return new ModuleCategoryMerger(project);
        }

        return undefined;
    }
}
