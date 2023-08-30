[![NPM Version](https://badge.fury.io/js/typedoc-plugin-merge-modules.svg)](https://badge.fury.io/js/typedoc-plugin-merge-modules) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

# typedoc-plugin-merge-modules

This is a plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that merges the content of modules.

Use cases:

* If you want to document an entire application and not a library, you can specify all files that you want to have documented as entry points for TypeDoc and use this plugin to merge all modules into the project root removing the extra module layer.
* If you want to merge the content of some modules in the TypeDoc output, you can use this plugin and [module annotations](https://typedoc.org/guides/doccomments/#files) in your files to specify which modules should be combined.

## Example

Here is an example of how the navigation menu of TypeDoc's output changes when merging all modules into the project root using the plugin:

![Example](https://raw.githubusercontent.com/krisztianb/typedoc-plugin-merge-modules/master/doc/example.png)

## Installation

This module can be installed using [npm](https://www.npmjs.com/package/typedoc-plugin-merge-modules):

```sh
$ npm install typedoc-plugin-merge-modules --save-dev
```

The plugin requires TypeDoc version 0.24.x or 0.25.x to be installed. After installation you need to activate the plugin with a [typedoc command line argument](https://typedoc.org/options/configuration/#plugin) or inside your [typedoc config file](https://typedoc.org/options/configuration/#json-files).

Here is an example using a JavaScript config file:

```js
/** @type { import('typedoc').TypeDocOptionMap & import('typedoc-plugin-merge-modules').Config } */
module.exports = {
    out: "output",
    entryPointStrategy: "expand",
    entryPoints: ["input/module1.ts", "input/module2.ts"],
    tsconfig: "tsconfig.json",
    readme: "MAIN.md",
    plugin: ["typedoc-plugin-merge-modules"],
    mergeModulesRenameDefaults: true, // NEW option of TypeDoc added by this plugin
    mergeModulesMergeMode: "project", // NEW option of TypeDoc added by this plugin
};
```

After installation TypeDoc can be used normally and you can configure this plugin as described below.

## Options

The following options are added to TypeDoc when the plugin is installed:

| Name & Format | Description | Default |
| ------------- | ----------- | ------- |
| **mergeModulesRenameDefaults** `<boolean>` | Defines if the plugin should rename default exports to their original name. | `true` |
| **mergeModulesMergeMode** `<"project"\|"module"\|"module-category"\|"off">` | Defines how the plugin should merge modules:<br/><br/><ul><li>`"project"` = The plugin merges the content of all modules into the project root.</li><li>`"module"` = The plugin merges modules with the same name. By default the filename is the module name, which you can overwrite using [module comments](https://typedoc.org/tags/module/).</li><li>`"module-category"` = Same as `"module"` but will only merge modules that have the same [category](https://typedoc.org/tags/category/).</li><li>`"off"` =  Disables the plugin.</li></ul> | `"project"` |

When you set `mergeModulesMergeMode` to `"module"` OR `"module-category"` in combination with [module comments](https://typedoc.org/tags/module/) you should add the tag `@mergeTarget` to the comment of the module whose comment should be used in the merge result.

## Bugs

Please report bugs [here](https://github.com/krisztianb/typedoc-plugin-merge-modules/issues).
Thanks for your contribution!

## Credits

Special thanks go to the following people that contributed to this project:

-   [Gerrit Birkeland](https://github.com/Gerrit0) for the suggested solution and code example.
-   [Felipe Santos](https://github.com/felipecrs) for suggesting improvements.
-   [Sho Otani](https://github.com/beijaflor) for implementing the merging of modules by name.

## Donate

If you find this piece of software helpful, please consider a donation. Any amount is greatly appreciated.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)
