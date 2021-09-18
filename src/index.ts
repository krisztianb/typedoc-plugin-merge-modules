import { Application } from "typedoc";
import { Plugin } from "./plugin";

/**
 * Initializes the plugin.
 * @param app Reference to the application that is loading the plugin.
 */
export function load(app: Readonly<Application>): void {
    new Plugin().initialize(app);
}
