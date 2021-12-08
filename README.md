[![NPM Version](https://badge.fury.io/js/typedoc-plugin-merge-modules.svg)](https://badge.fury.io/js/typedoc-plugin-merge-modules) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

# typedoc-plugin-merge-modules

This is a plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that merges the content of modules.

Use cases:

* If you want to document an entire application and not a library, you can specify all files that you want to have documented as entry points for TypeDoc and use this plugin to merge all modules into the project root removing the extra module layer.
* If you want to merge the content of some modules in the TypeDoc output, you can use this plugin and [module annotations](https://typedoc.org/guides/doccomments/#files) in your files to specify which modules should be combined.

## Installation

This module can be installed using [npm](https://www.npmjs.com/package/typedoc-plugin-merge-modules):

```sh
$ npm install typedoc-plugin-merge-modules --save-dev
```

TypeDoc automatically detects plugins installed via npm. After installation TypeDoc can be used normally and you can
configure this plugin as described below.

## Example

When running TypeDoc with two module files `module1.ts` and `module2.ts` as entry points produces the following result:

![Before](https://raw.githubusercontent.com/krisztianb/typedoc-plugin-merge-modules/master/doc/before-example.png)

Using this plugin will make the result look like this:

![After](https://raw.githubusercontent.com/krisztianb/typedoc-plugin-merge-modules/master/doc/after-example.png)

## Options

The following options are added to TypeDoc when the plugin is installed:

| Name & Format | Description | Default |
| ------------- | ----------- | ------- |
| **mergeModulesRenameDefaults** `<boolean>` | Defines if the plugin should rename default exports to their original name. | `true` |
| **mergeModulesMergeMode** `<"project"\|"module"\|"off">` | Defines if the plugin should merge all modules into the project or if it should merge modules based on their name or module annotation. You can use the value `"off"` to disable the plugin. | `"project"` |

When using `mergeModulesMergeMode: module` in combination with [module comments](https://typedoc.org/guides/doccomments/#files) you should add the tag `@mergeTarget` to the comment of the module whose comment should be used in the merge result.

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
