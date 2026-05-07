"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = migration;
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../../utils");
const dependencies_1 = require("../utils/dependencies");
const updatedTypeScriptESLintVersion = '5.59.2';
const updatedESLintVersion = '8.39.0';
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
        updateA11yRules,
    ]);
}
// Remove the accessibility- prefix from all relevant template rules
function updateA11yRules() {
    function modifyRules(parent) {
        if (!parent.rules) {
            return;
        }
        for (const rule of Object.keys(parent.rules)) {
            if (rule.startsWith('@angular-eslint/template/accessibility-')) {
                const ruleConfig = parent.rules[rule];
                parent.rules[rule.replace('accessibility-', '')] = ruleConfig;
                delete parent.rules[rule];
            }
        }
    }
    return (0, schematics_1.chain)([
        (0, utils_1.visitNotIgnoredFiles)((filePath) => {
            if (!filePath.endsWith('.eslintrc.json')) {
                return;
            }
            return (0, utils_1.updateJsonInTree)(filePath.toString(), (json) => {
                if (json.overrides) {
                    for (const override of json.overrides) {
                        modifyRules(override);
                    }
                }
                modifyRules(json);
                return json;
            });
        }),
    ]);
}
