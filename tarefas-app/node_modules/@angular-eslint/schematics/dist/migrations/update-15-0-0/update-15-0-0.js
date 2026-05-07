"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = migration;
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../../utils");
const dependencies_1 = require("../utils/dependencies");
const updatedTypeScriptESLintVersion = '5.43.0';
const updatedESLintVersion = '8.28.0';
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
        (0, utils_1.updateJsonInTree)('angular.json', (json) => {
            return (0, utils_1.updateSchematicDefaults)(json, '@angular-eslint/schematics:application', {
                setParserOptionsProject: true,
            });
        }),
        (0, utils_1.updateJsonInTree)('angular.json', (json) => {
            return (0, utils_1.updateSchematicDefaults)(json, '@angular-eslint/schematics:library', {
                setParserOptionsProject: true,
            });
        }),
    ]);
}
