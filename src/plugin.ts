import { Application, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";

/**
 * The "All In One" plugin.
 *
 * # What does it do?
 *
 * This plugin moves the content of all modules into the project itself.
 */
export class Plugin {
    /**
     * Initializes the plugin.
     * @param typedoc The TypeDoc application.
     */
    public initialize(typedoc: Readonly<Application>): void {
        this.subscribeToApplicationEvents(typedoc);
    }

    /**
     * Subscribes to events of the application so that the plugin can do its work
     * in the particular doc generation phases.
     * @param typedoc The TypeDoc application.
     */
    private subscribeToApplicationEvents(typedoc: Readonly<Application>): void {
        typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (c: Readonly<Context>) => this.onConverterResolveBegin(c));
    }

    /**
     * Triggered when the TypeDoc converter begins resolving a project.
     * @param context Describes the current state the converter is in.
     */
    // eslint-disable-next-line class-methods-use-this
    public onConverterResolveBegin(context: Readonly<Context>): void {
        const project = context.project;
        const modules = project.children ?? [];

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
}
