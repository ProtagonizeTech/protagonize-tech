"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const utils_1 = require("../../utils");
const updatedAngularESLintVersion = '^4.0.0';
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
function default_1() {
    return (0, schematics_1.chain)([updateRelevantDependencies]);
}
