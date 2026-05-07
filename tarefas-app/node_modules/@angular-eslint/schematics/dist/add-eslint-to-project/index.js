"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addESLintToProject;
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
function addESLintToProject(schema) {
    return (tree) => {
        const projectName = (0, utils_1.determineTargetProjectName)(tree, schema.project);
        if (!projectName) {
            throw new Error('\n' +
                `
Error: You must specify a project to add ESLint to because you have multiple projects in your angular.json

E.g. npx ng g @angular-eslint/schematics:add-eslint-to-project {{YOUR_PROJECT_NAME_GOES_HERE}}
        `.trim());
        }
        return (0, schematics_1.chain)([
            // Create the ESLint config file for the project
            (0, utils_1.createESLintConfigForProject)(projectName, schema.setParserOptionsProject ?? false),
            // Set the lint builder and config in angular.json
            (0, utils_1.addESLintTargetToProject)(projectName, 'lint'),
        ]);
    };
}
