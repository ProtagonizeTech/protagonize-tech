"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = migration;
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../../utils");
const dependencies_1 = require("../utils/dependencies");
const updatedAngularESLintVersion = '^12.0.0';
const updatedTypeScriptESLintVersion = '4.28.2';
const updatedESLintVersion = '7.26.0';
function migrateToAccessibilityLabelHasAssociatedControlSchema(rule) {
    if (!Array.isArray(rule) || rule.length !== 2)
        return;
    const [, currentSchema] = rule;
    rule[1] = {
        controlComponents: currentSchema.controlComponents,
        labelComponents: currentSchema.labelComponents.map((selector) => {
            return { inputs: currentSchema.labelAttributes, selector };
        }),
    };
}
function migrateFromAccessibilityLabelFor({ overrides, rules, }) {
    migrateToAccessibilityLabelHasAssociatedControlSchema(rules?.['@angular-eslint/template/accessibility-label-for']);
    migrateToAccessibilityLabelHasAssociatedControlName(rules);
    for (const override of overrides ?? []) {
        migrateToAccessibilityLabelHasAssociatedControlSchema(override.rules?.['@angular-eslint/template/accessibility-label-for']);
        migrateToAccessibilityLabelHasAssociatedControlName(override.rules);
    }
}
function migrateToAccessibilityLabelHasAssociatedControlName(rules) {
    if (!rules)
        return;
    const accessibilityLabelForRule = rules['@angular-eslint/template/accessibility-label-for'];
    delete rules['@angular-eslint/template/accessibility-label-for'];
    rules['@angular-eslint/template/accessibility-label-has-associated-control'] =
        accessibilityLabelForRule;
}
function updateAccessibilityLabelFor() {
    return (0, schematics_1.chain)([
        (0, utils_1.visitNotIgnoredFiles)((filePath) => {
            if (!filePath.endsWith('.eslintrc.json')) {
                return;
            }
            return (0, utils_1.updateJsonInTree)(filePath.toString(), (json) => {
                migrateFromAccessibilityLabelFor(json);
                return json;
            });
        }),
    ]);
}
function addEqeqeqIfNeeded(rules) {
    if (!rules ||
        !rules['@angular-eslint/template/no-negated-async'] ||
        rules['@angular-eslint/template/eqeqeq']) {
        return;
    }
    rules['@angular-eslint/template/eqeqeq'] = 'error';
}
function addEqeqeq() {
    return (0, schematics_1.chain)([
        (0, utils_1.visitNotIgnoredFiles)((filePath) => {
            if (!filePath.endsWith('.eslintrc.json')) {
                return;
            }
            return (0, utils_1.updateJsonInTree)(filePath.toString(), (json) => {
                addEqeqeqIfNeeded(json.rules);
                (json.overrides ?? []).forEach((override) => addEqeqeqIfNeeded(override.rules));
                return json;
            });
        }),
    ]);
}
function migration() {
    return (0, schematics_1.chain)([
        (0, dependencies_1.updateDependencies)([
            {
                packageName: '@angular-eslint/builder',
                version: updatedAngularESLintVersion,
            },
            {
                packageName: '@angular-eslint/eslint-plugin',
                version: updatedAngularESLintVersion,
            },
            {
                packageName: '@angular-eslint/eslint-plugin-template',
                version: updatedAngularESLintVersion,
            },
            {
                packageName: '@angular-eslint/template-parser',
                version: updatedAngularESLintVersion,
            },
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
        ]),
        updateAccessibilityLabelFor,
        addEqeqeq,
    ]);
}
