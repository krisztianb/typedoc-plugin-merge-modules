# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.1.0] - 2023-08-30
### Added
-   Added support for latest TypeDoc version 0.25.x.
-   The plugin now includes typings for its configuation that you can use in your TypeDoc config. (see README)

## [5.0.1] - 2023-05-27
### Fixed
-   Categories and groups are incomplete when merging modules in a monorepo project.

## [5.0.0] - 2023-05-01
### Breaking Changes
-   Support changed to TypeDoc versions 0.24.x due to a breaking change in TypeDoc's API.
### Fixed
-   Monorepos were not merged correctly in version 4.1.0

## [4.1.0] - 2023-04-23
### Changes
-   Added support for latest TypeDoc version 0.24.x.

## [4.0.1] - 2022-07-09
### Fixed
-   Plugin doesn't rename certain types of default exports.

## [4.0.0] - 2022-07-03
### Breaking Changes
-   Support changed to TypeDoc versions 0.23.x due to a breaking change in TypeDoc's API.
### Added
-   Option `mergeModulesMergeMode` now has a new value `module-category` to merge modules with the same name but only
    if they are within the same category.
### Fixed
-   Renaming of default exports now also works for: enums, object literals, type literals and type aliases.

## [3.1.0] - 2021-12-08
### Added
-   When merging modules by name you can use the comment tag `@mergeTarget` to define the module into which the other
    modules with the same name should be merged. The comment of this module is used in the resulting module.

## [3.0.2] - 2021-09-18
### Added
-   Add support for TypeDoc version 0.22.

## [3.0.1] - 2021-08-08
### Fixed
-   Plugin doesn't rename default exports of type interface.

## [3.0.0] - 2021-07-18
### Breaking Changes
-   Support changed to TypeDoc versions >=0.21.0 due to a breaking change in TypeDoc's API.

## [2.1.1] - 2021-06-07
### Fixed
-   Plugin would rename default exports when setting option `mergeModulesMergeMode` to `off`.

## [2.1.0] - 2021-06-06
### Added
-   New option `mergeModulesMergeMode` to merge by module names or to turn the plugin off.

## [2.0.0] - 2021-03-13
### Added
-   New option `mergeModulesRenameDefaults` to rename default exports.
### Breaking Changes
-   New option `mergeModulesRenameDefaults` is `true` by default.

## [1.0.0] - 2021-01-30

First release

[unreleased]: https://github.com/krisztianb/typedoc-plugin-merge-modules/compare/v5.1.0...HEAD
[5.1.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v5.1.0
[5.0.1]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v5.0.1
[5.0.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v5.0.0
[4.1.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v4.1.0
[4.0.1]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v4.0.1
[4.0.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v4.0.0
[3.1.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v3.1.0
[3.0.2]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v3.0.2
[3.0.1]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v3.0.1
[3.0.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v3.0.0
[2.1.1]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v2.1.1
[2.1.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v2.1.0
[2.0.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v2.0.0
[1.0.0]: https://github.com/krisztianb/typedoc-plugin-merge-modules/releases/tag/v1.0.0
