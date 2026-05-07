"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.FORWARD_REF = exports.RULE_NAME = void 0;
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-forward-ref';
exports.FORWARD_REF = 'forwardRef';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Disallows usage of \`${exports.FORWARD_REF}\` references for DI`,
        },
        schema: [],
        messages: {
            noForwardRef: `Avoid using \`${exports.FORWARD_REF}\``,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [`CallExpression[callee.type="Identifier"][callee.name="${exports.FORWARD_REF}"]`](node) {
                context.report({
                    node,
                    messageId: 'noForwardRef',
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "The forwardRef() function is a workaround for circular dependencies in Angular's dependency injection system, but it obscures the dependency graph and can make code harder to understand and maintain. When forwardRef() is used, it's often a sign of poor architecture, such as circular dependencies between components or services that could be resolved through better abstraction. Modern Angular and TypeScript have reduced the need for forwardRef() in most cases. Instead, consider restructuring your code to eliminate circular dependencies, using interfaces for dependency injection, or moving shared logic into a separate service.",
};
