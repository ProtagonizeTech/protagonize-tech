"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = migration;
const schematics_1 = require("@angular-devkit/schematics");
const dependencies_1 = require("../utils/dependencies");
const updatedTypeScriptESLintVersion = '6.10.0';
const updatedESLintVersion = '8.53.0';
function migration() {
    return (0, schematics_1.chain)([
        (0, dependencies_1.updateDependencies)([
            {
                packageName: '@typescript-eslint/eslint-plugin',
                version: `^${updatedTypeScriptESLintVersion}`,
            },
            {
                packageName: '@typescript-eslint/utils',
                version: `^${updatedTypeScriptESLintVersion}`,
            },
            {
                packageName: '@typescript-eslint/parser',
                version: `^${updatedTypeScriptESLintVersion}`,
            },
            {
                packageName: 'eslint',
                version: `^${updatedESLintVersion}`,
            },
        ]),
    ]);
}
