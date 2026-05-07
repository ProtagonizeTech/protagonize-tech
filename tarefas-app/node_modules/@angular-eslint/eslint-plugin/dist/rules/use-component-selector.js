"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'use-component-selector';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Component selector must be declared',
        },
        schema: [],
        messages: {
            useComponentSelector: 'The selector of the component is mandatory',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [utils_1.Selectors.COMPONENT_CLASS_DECORATOR](node) {
                const selector = utils_1.ASTUtils.getDecoratorPropertyValue(node, 'selector');
                if (selector &&
                    ((utils_1.ASTUtils.isStringLiteral(selector) && selector.value.length) ||
                        utils_1.ASTUtils.isTemplateLiteral(selector) ||
                        utils_2.ASTUtils.isIdentifier(selector))) {
                    return;
                }
                context.report({
                    node,
                    messageId: 'useComponentSelector',
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Every component should have a selector that defines how it's used in templates. Omitting the selector makes the component unusable in templates and can only be used with dynamic component loading or routing, which is rarely the intent. When debugging, components without selectors are harder to identify in the component tree and browser DevTools. If a component is truly only meant for dynamic loading (like a modal or route component), you can disable this rule for that component, but in most cases, every component should have a meaningful selector.",
};
