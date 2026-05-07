"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const utils_1 = require("../../utils");
const updatedAngularESLintVersion = '^3.0.0';
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
        context.addTask(new tasks_1.NodePackageInstallTask());
        return json;
    })(host, context);
}
function addRecommendedExtraExtendsWhereApplicable(config) {
    // Convert extends to array if applicable
    if (typeof config.extends === 'string' &&
        config.extends === 'plugin:@angular-eslint/recommended') {
        config.extends = [config.extends];
    }
    if (Array.isArray(config.extends) &&
        config.extends.includes('plugin:@angular-eslint/recommended')) {
        config.extends.push('plugin:@angular-eslint/recommended--extra');
    }
    if (config.overrides) {
        for (const override of config.overrides) {
            if (typeof override.extends === 'string' &&
                override.extends === 'plugin:@angular-eslint/recommended') {
                override.extends = [override.extends];
            }
            if (Array.isArray(override.extends) &&
                override.extends.includes('plugin:@angular-eslint/recommended')) {
                override.extends.push('plugin:@angular-eslint/recommended--extra');
            }
        }
    }
}
function applyRecommendedExtraExtends() {
    return (0, schematics_1.chain)([
        (0, utils_1.visitNotIgnoredFiles)((filePath) => {
            if (!filePath.endsWith('.eslintrc.json')) {
                return;
            }
            return (0, utils_1.updateJsonInTree)(filePath.toString(), (json) => {
                addRecommendedExtraExtendsWhereApplicable(json);
                return json;
            });
        }),
    ]);
}
function removeNegativeValuesFromComponentMaxInlineDeclarations(rule) {
    if (!Array.isArray(rule) || rule.length !== 2)
        return;
    const [, currentSchema] = rule;
    rule[1] = Object.entries(currentSchema).reduce((accumulator, [key, value]) => {
        return Number(value) < 0 ? accumulator : { ...accumulator, [key]: value };
    }, {});
}
function updateComponentMaxInlineDeclarationsSchema({ overrides, rules, }) {
    removeNegativeValuesFromComponentMaxInlineDeclarations(rules?.['@angular-eslint/component-max-inline-declarations']);
    for (const override of overrides ?? []) {
        removeNegativeValuesFromComponentMaxInlineDeclarations(override.rules?.['@angular-eslint/component-max-inline-declarations']);
    }
}
function updateComponentMaxInlineDeclarations() {
    return (0, schematics_1.chain)([
        (0, utils_1.visitNotIgnoredFiles)((filePath) => {
            if (!filePath.endsWith('.eslintrc.json')) {
                return;
            }
            return (0, utils_1.updateJsonInTree)(filePath.toString(), (json) => {
                updateComponentMaxInlineDeclarationsSchema(json);
                return json;
            });
        }),
    ]);
}
function default_1() {
    return (0, schematics_1.chain)([
        updateRelevantDependencies,
        applyRecommendedExtraExtends,
        updateComponentMaxInlineDeclarations,
    ]);
}
