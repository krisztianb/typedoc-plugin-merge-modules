// @ts-check
import eslint from "@eslint/js";
// @ts-ignore -- This works fine
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import tslint from "typescript-eslint";

/** @type {import("typescript-eslint").Config} */
export default tslint.config(
    eslint.configs.recommended,
    ...tslint.configs.recommended,
    ...tslint.configs.strictTypeChecked,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        plugins: {
            unicorn,
            jsdoc,
        },
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        files: ["**/*.ts"],
        rules: {
            // Possible errors
            "no-await-in-loop": "error",
            "no-extra-semi": "off", // in favor of @typescript-eslint/no-extra-semi (part of recommended)
            "no-promise-executor-return": "error",
            "no-template-curly-in-string": "error",
            "no-unreachable-loop": "error",
            "no-useless-backreference": "error",
            "require-atomic-updates": "error",

            // Best practices
            "class-methods-use-this": "error",
            "consistent-return": "error",
            curly: "error",
            "default-case-last": "error",
            eqeqeq: "error",
            "no-constructor-return": "error",
            "no-else-return": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-extra-label": "error",
            "no-floating-decimal": "error",
            "no-implicit-coercion": "error",
            "no-iterator": "error",
            "no-lone-blocks": "error",
            "no-multi-str": "error",
            "no-new": "error",
            "no-new-wrappers": "error",
            "no-octal-escape": "error",
            "no-proto": "error",
            "no-redeclare": "off", // in favor of @typescript-eslint/no-redeclare
            "no-return-assign": "error",
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-throw-literal": "error",
            "no-unmodified-loop-condition": "error",
            "no-useless-call": "error",
            "no-useless-concat": "error",
            "no-useless-return": "error",
            "no-void": "error",
            "no-warning-comments": ["warn", { terms: ["todo"], location: "anywhere" }],
            radix: "error",
            "wrap-iife": "error",
            yoda: "error",

            // Variables
            "no-label-var": "error",
            "no-undef-init": "error",
            "no-unused-vars": "off", // in favor of @typescript-eslint/no-unused-vars (part of recommended)

            // Stylistic issues
            "id-denylist": [
                "error",
                "any",
                "Number",
                "number",
                "String",
                "string",
                "Boolean",
                "boolean",
                "Undefined",
                "undefined",
            ],
            "max-len": ["error", { code: 120, ignoreComments: false, ignoreTrailingComments: false }], // length should match Prettier config
            "no-lonely-if": "error",
            "no-nested-ternary": "error",
            "no-unneeded-ternary": "error",
            "unicode-bom": "error",

            // ECMAScript 6
            "no-confusing-arrow": "error",
            "no-dupe-class-members": "off", // in favor of @typescript-eslint/no-dupe-class-members
            "no-duplicate-imports": "error",
            "no-var": "error",
            "prefer-const": "error",
            "prefer-rest-params": "error",
            "no-useless-rename": "error",

            // plugin: @typescript-eslint - basic rules
            "@typescript-eslint/naming-convention": "error",
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/explicit-function-return-type": ["error"],
            "@typescript-eslint/explicit-member-accessibility": ["error"],
            "@typescript-eslint/no-confusing-non-null-assertion": ["error"],
            "@typescript-eslint/no-extraneous-class": ["error"],
            "@typescript-eslint/no-invalid-void-type": ["error"],
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": ["error"],
            "@typescript-eslint/no-unnecessary-condition": ["error"],
            "@typescript-eslint/no-unnecessary-qualifier": ["error"],
            "@typescript-eslint/no-unnecessary-type-arguments": ["error"],
            "@typescript-eslint/prefer-enum-initializers": ["error"],
            "@typescript-eslint/prefer-for-of": ["error"],
            "@typescript-eslint/prefer-literal-enum-member": ["error"],
            "@typescript-eslint/prefer-readonly": ["error"],
            "@typescript-eslint/promise-function-async": ["error"],

            // plugin: @typescript-eslint - extension rules
            "@typescript-eslint/default-param-last": ["error"],
            "@typescript-eslint/no-dupe-class-members": ["error"],
            "@typescript-eslint/no-invalid-this": ["error"],
            "@typescript-eslint/no-loop-func": ["error"],
            "@typescript-eslint/no-loss-of-precision": ["error"],
            "@typescript-eslint/no-redeclare": ["error"],
            "@typescript-eslint/no-shadow": ["error"],
            "@typescript-eslint/no-unused-expressions": ["error"],
            "@typescript-eslint/no-use-before-define": ["error"],
            "@typescript-eslint/no-useless-constructor": ["error"],
            "@typescript-eslint/return-await": ["error"],

            // plugin: unicorn
            "unicorn/custom-error-definition": ["error"],
            "unicorn/explicit-length-check": ["error"],
            "unicorn/filename-case": ["error", { case: "snakeCase" }],
            "unicorn/new-for-builtins": ["error"],
            "unicorn/no-abusive-eslint-disable": ["error"],
            "unicorn/no-instanceof-array": ["error"],
            "unicorn/no-null": ["error"],
            "unicorn/no-unused-properties": ["error"],
            "unicorn/prefer-includes": ["error"],
            "unicorn/prefer-string-starts-ends-with": ["error"],
            "unicorn/prefer-ternary": ["error"],
            "unicorn/prefer-dom-node-text-content": ["error"],

            // plugin:import
            "import/no-unresolved": "off", // checked by TS
            "import/no-cycle": "error",
            "import/order": [
                "error",
                {
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: false,
                    },
                },
            ],

            // plugin: jsdoc
            "jsdoc/check-param-names": ["error"],
            "jsdoc/check-tag-names": ["error"],
            "jsdoc/empty-tags": ["error"],
            "jsdoc/no-types": ["error"],
            "jsdoc/require-description-complete-sentence": ["error"],
            "jsdoc/require-jsdoc": ["error"],
            "jsdoc/require-param-description": ["error"],
            "jsdoc/require-param-name": ["error"],
            "jsdoc/require-param": ["error"],
            "jsdoc/require-returns-check": ["error"],
            "jsdoc/require-returns-description": ["error"],
            "jsdoc/require-returns": ["error"],
            "jsdoc/require-throws": ["error"],
        },
    },
);
