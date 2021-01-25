[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

# typedoc-plugin-allinone

This is a plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that merges all modules into one.

Before version 0.20 TypeDoc had a **file mode** which created a documentation whos output didn't consider modules as
units of separation. This was useful for creating a documentation for entire TypeScript applications (not libraries).

Since version 0.20 this file mode is no longer available. Every TypeDoc entry point is documented as a separate module.
If you specify all the files you want to document as entry points you end up with a documenation containing dozens or
hundreds of modules. This makes the documentation extremely difficult to follow.

This plugin brings back file mode to TypeDoc by merging all modules into one.

## Installation

This module can be installed using [npm](https://www.npmjs.com/package/typedoc-plugin-allinone):

```sh
$ npm install typedoc-plugin-allinone --save-dev
```

TypeDoc automatically detects plugins installed via npm. After installation TypeDoc can be used normally and you can
configure this plugin as described below.

## Configuration

Currently this plugin has no configuration options.

## Bugs

Please report bugs [here](https://github.com/krisztianb/typedoc-plugin-allinone/issues).
Thanks for your contribution!

## Donate

If you find this piece of software helpful, please consider a donation. Any amount is greatly appreciated.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)
