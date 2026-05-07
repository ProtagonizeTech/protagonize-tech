"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = migration;
const schematics_1 = require("@angular-devkit/schematics");
const dependencies_1 = require("../utils/dependencies");
const updatedTypeScriptESLintVersion = '8.33.1';
const updatedESLintVersion = '9.28.0';
function migration() {
    return (0, schematics_1.chain)([
        (host) => {
            const packageJson = JSON.parse(host.read('package.json').toString());
            if (packageJson.devDependencies['typescript-eslint'] ||
                packageJson.devDependencies['@typescript-eslint/parser'].startsWith('8.') ||
                packageJson.devDependencies['@typescript-eslint/parser'].startsWith('^8.') ||
                packageJson.devDependencies['@typescript-eslint/parser'].startsWith('~8.')) {
                return (0, dependencies_1.updateDependencies)([
                    {
                        packageName: '@typescript-eslint/eslint-plugin',
                        version: `^${updatedTypeScriptESLintVersion}`,
                    },
                    {
                        packageName: '@typescript-eslint/utils',
                        version: `^${updatedTypeScriptESLintVersion}`,
                    },
                    {
                        packageName: '@typescript-eslint/type-utils',
                        version: `^${updatedTypeScriptESLintVersion}`,
                    },
                    {
                        packageName: '@typescript-eslint/parser',
                        version: `^${updatedTypeScriptESLintVersion}`,
                    },
                    {
                        packageName: '@typescript-eslint/rule-tester',
                        version: `^${updatedTypeScriptESLintVersion}`,
                    },
                    {
                        packageName: 'typescript-eslint',
                        version: `^${updatedTypeScriptESLintVersion}`,
                    },
                    {
                        packageName: 'eslint',
                        version: `^${updatedESLintVersion}`,
                    },
                ]);
            }
            return undefined;
        },
    ]);
}
