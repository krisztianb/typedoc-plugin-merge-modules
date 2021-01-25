import { Application } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import { PluginOptions } from "./plugin_options";

/**
 * The "replace in comments" plugin.
 *
 * # What does it do?
 *
 * This plugin replaces text in comments with other text.
 *
 * # How does it do it?
 *
 * The plugin scans through all comments of all reflections and uses the replacment patterns specified
 * by the user to replace text in these comments.
 */
export class Plugin {
    /** The options of this plugin. */
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
     * Triggered when the TypeDoc converter begins resolving a project.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveBegin(context: Readonly<Context>): void {
        if (this.options.replacements.length > 0) {
            const project = context.project;

            // go through all the reflections' comments
            for (const key in project.reflections) {
                const reflection = project.reflections[key];

                if (reflection.comment) {
                    reflection.comment.shortText = this.replaceInComment(reflection.comment.shortText);
                    reflection.comment.text = this.replaceInComment(reflection.comment.text);
                }
            }
        }
    }

    /**
     * Applies the replacement info to the comment.
     * @param comment The comment on which to apply the replacement info.
     * @returns The modified comment.
     */
    private replaceInComment(comment: string): string {
        for (const replacement of this.options.replacements) {
            comment = comment.replace(replacement.regex, replacement.replace);
        }

        return comment;
    }
}
