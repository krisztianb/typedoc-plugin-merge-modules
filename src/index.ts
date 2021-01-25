import { PluginHost } from "typedoc/dist/lib/utils";
import { Plugin } from "./plugin";

/**
 * Initializes the plugin.
 * @param host Reference to the host that is loading the plugin.
 */
export function load(host: Readonly<PluginHost>): void {
    new Plugin().initialize(host.application);
}
