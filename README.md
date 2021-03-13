[![NPM Version](https://badge.fury.io/js/typedoc-plugin-merge-modules.svg)](https://badge.fury.io/js/typedoc-plugin-merge-modules) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

# typedoc-plugin-merge-modules

This is a plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that moves the content of all modules into the
project itself.

Before version 0.20 TypeDoc had a **file mode** which created a documentation whos output didn't consider modules as
units of separation. This was useful for documentating entire TypeScript applications where modules are irrelevant.

Since version 0.20 file mode is no longer available in TypeDoc. Use this plugin to bring back file mode to TypeDoc.

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

## Bugs

Please report bugs [here](https://github.com/krisztianb/typedoc-plugin-merge-modules/issues).
Thanks for your contribution!

## Credits

Special thanks go to the following people that influenced this project:

-   [Gerrit Birkeland](https://github.com/Gerrit0) for the suggested solution and code example.
-   [Felipe Santos](https://github.com/felipecrs) for suggesting improvements.

## Donate

If you find this piece of software helpful, please consider a donation. Any amount is greatly appreciated.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)
