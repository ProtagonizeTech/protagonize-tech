"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = migration;
const schematics_1 = require("@angular-devkit/schematics");
const dependencies_1 = require("../utils/dependencies");
const updatedTypeScriptESLintVersion = '5.3.0';
const updatedESLintVersion = '8.2.0';
const updatedESLintPluginImportVersion = '2.25.2';
function migration() {
    return (0, schematics_1.chain)([
        (0, dependencies_1.updateDependencies)([
            {
                packageName: '@typescript-eslint/eslint-plugin',
                version: updatedTypeScriptESLintVersion,
            },
            {
                packageName: '@typescript-eslint/experimental-utils',
                version: updatedTypeScriptESLintVersion,
            },
            {
                packageName: '@typescript-eslint/parser',
                version: updatedTypeScriptESLintVersion,
            },
            {
                packageName: 'eslint',
                version: `^${updatedESLintVersion}`,
            },
            {
                packageName: 'eslint-plugin-import',
                version: updatedESLintPluginImportVersion,
            },
        ]),
    ]);
}
