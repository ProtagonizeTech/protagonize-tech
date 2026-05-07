"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
function eslintRelatedChanges(options) {
    return (0, schematics_1.chain)([
        // Create the ESLint config file for the project
        (0, utils_1.createESLintConfigForProject)(options.name, options.setParserOptionsProject ?? false),
        // Update the lint builder and config in angular.json
        (0, utils_1.addESLintTargetToProject)(options.name, 'lint'),
    ]);
}
function default_1(options) {
    return (host, context) => {
        // Remove angular-eslint specific options before passing to the Angular schematic
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { setParserOptionsProject, ...angularOptions } = options;
        return (0, schematics_1.chain)([
            (0, schematics_1.externalSchematic)('@schematics/angular', 'library', angularOptions),
            eslintRelatedChanges(options),
        ])(host, context);
    };
}
