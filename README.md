[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

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

## Configuration

Currently this plugin has no configuration options.

## Bugs

Please report bugs [here](https://github.com/krisztianb/typedoc-plugin-merge-modules/issues).
Thanks for your contribution!

## Donate

If you find this piece of software helpful, please consider a donation. Any amount is greatly appreciated.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)
