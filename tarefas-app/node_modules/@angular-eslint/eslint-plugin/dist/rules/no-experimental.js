"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const eslint_utils_1 = require("@typescript-eslint/utils/eslint-utils");
const jsdoc_1 = require("../utils/jsdoc");
exports.RULE_NAME = 'no-experimental';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: `Disallow using code which is marked as experimental`,
        },
        schema: [],
        messages: {
            noExperimental: '`{{name}}` is experimental',
        },
    },
    defaultOptions: [],
    create(context) {
        const services = (0, eslint_utils_1.getParserServices)(context);
        const checker = services.program.getTypeChecker();
        return {
            Identifier: (node) => {
                if ((0, jsdoc_1.isDeclaration)(node) || (0, jsdoc_1.isInsideExportOrImport)(node)) {
                    return;
                }
                const symbols = (0, jsdoc_1.getSymbols)(node, services, checker);
                if (!(0, jsdoc_1.hasJsDocTag)(symbols, 'experimental')) {
                    return;
                }
                const { name } = node;
                context.report({
                    node,
                    messageId: 'noExperimental',
                    data: { name },
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: `Angular's [experimental APIs](https://angular.dev/reference/releases#experimental) are subject to significant changes or removal without notice and are not covered by Angular's [breaking change policy](https://angular.dev/reference/releases#breaking-change-policy-and-update-paths). These APIs may change even in patch releases, making them risky for production applications.`,
};
