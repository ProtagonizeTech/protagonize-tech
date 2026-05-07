"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const utils_1 = require("../../utils");
const updatedAngularESLintVersion = '^2.0.0';
const updatedTypeScriptESLintVersion = '4.16.1';
function updateIfExists(deps, depName, updatedVersion) {
    if (deps?.[depName]) {
        deps[depName] = updatedVersion;
    }
}
function updateRelevantDependencies(host, context) {
    return (0, utils_1.updateJsonInTree)('package.json', (json) => {
        /**
         * @angular-eslint
         */
        updateIfExists(json.devDependencies, '@angular-eslint/builder', updatedAngularESLintVersion);
        updateIfExists(json.devDependencies, '@angular-eslint/eslint-plugin', updatedAngularESLintVersion);
        updateIfExists(json.devDependencies, '@angular-eslint/eslint-plugin-template', updatedAngularESLintVersion);
        updateIfExists(json.devDependencies, '@angular-eslint/template-parser', updatedAngularESLintVersion);
        /**
         * @typescript-eslint
         */
        updateIfExists(json.devDependencies, '@typescript-eslint/parser', updatedTypeScriptESLintVersion);
        updateIfExists(json.devDependencies, '@typescript-eslint/eslint-plugin', updatedTypeScriptESLintVersion);
        context.addTask(new tasks_1.NodePackageInstallTask());
        return json;
    })(host, context);
}
function removeRuleFromESLintConfig(ruleName, config) {
    if (config.rules && config.rules[ruleName]) {
        delete config.rules[ruleName];
    }
    if (config.overrides) {
        for (const override of config.overrides) {
            if (override.rules && override.rules[ruleName]) {
                delete override.rules[ruleName];
            }
        }
    }
}
function removeUsePipeDecoratorRule() {
    const ruleName = '@angular-eslint/use-pipe-decorator';
    return (0, schematics_1.chain)([
        (0, utils_1.visitNotIgnoredFiles)((filePath) => {
            if (!filePath.endsWith('.eslintrc.json')) {
                return;
            }
            return (0, utils_1.updateJsonInTree)(filePath.toString(), (json) => {
                removeRuleFromESLintConfig(ruleName, json);
                return json;
            });
        }),
    ]);
}
function default_1() {
    return (0, schematics_1.chain)([updateRelevantDependencies, removeUsePipeDecoratorRule]);
}
