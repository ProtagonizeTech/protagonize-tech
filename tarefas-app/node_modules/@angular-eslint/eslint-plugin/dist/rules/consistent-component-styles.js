"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'consistent-component-styles';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures consistent usage of `styles`/`styleUrls`/`styleUrl` within Component metadata',
        },
        fixable: 'code',
        schema: [
            {
                type: 'string',
                enum: ['array', 'string'],
            },
        ],
        messages: {
            useStyleUrl: 'Use `styleUrl` instead of `styleUrls` for a single stylesheet',
            useStyleUrls: 'Use `styleUrls` instead of `styleUrl`',
            useStylesArray: 'Use a `string[]` instead of a `string` for the `styles` property',
            useStylesString: 'Use a `string` instead of a `string[]` for the `styles` property',
        },
    },
    defaultOptions: ['string'],
    create(context, [mode]) {
        const { COMPONENT_CLASS_DECORATOR, metadataProperty } = utils_1.Selectors;
        const LITERAL_OR_TEMPLATE_LITERAL = ':matches(Literal, TemplateLiteral)';
        if (mode === 'array') {
            const stylesStringExpression = `${COMPONENT_CLASS_DECORATOR} ${metadataProperty('styles')} > ${LITERAL_OR_TEMPLATE_LITERAL}`;
            const styleUrlProperty = `${COMPONENT_CLASS_DECORATOR} ${metadataProperty('styleUrl')}:has(:matches(Literal, TemplateElement))`;
            return {
                [stylesStringExpression](node) {
                    context.report({
                        node,
                        messageId: 'useStylesArray',
                        fix: (fixer) => {
                            return fixer.replaceText(node, utils_1.ASTUtils.isStringLiteral(node)
                                ? `[${node.raw}]`
                                : `[${context.sourceCode.getText(node)}]`);
                        },
                    });
                },
                [styleUrlProperty](node) {
                    context.report({
                        node,
                        messageId: 'useStyleUrls',
                        fix: (fixer) => {
                            return fixer.replaceText(node, utils_1.ASTUtils.isStringLiteral(node.value)
                                ? `styleUrls: [${node.value.raw}]`
                                : `styleUrls: [${context
                                    .getSourceCode()
                                    .getText(node.value)}]`);
                        },
                    });
                },
            };
        }
        else {
            const singleArrayStringLiteral = `ArrayExpression:matches([elements.length=1]:has(${LITERAL_OR_TEMPLATE_LITERAL}))`;
            const singleStylesArrayExpression = `${COMPONENT_CLASS_DECORATOR} ${metadataProperty('styles')} > ${singleArrayStringLiteral}`;
            const singleStyleUrlsProperty = `${COMPONENT_CLASS_DECORATOR} ${metadataProperty('styleUrls')}:has(${singleArrayStringLiteral})`;
            return {
                [singleStylesArrayExpression](node) {
                    // The selector ensures the element is not null.
                    const el = node.elements[0];
                    context.report({
                        node,
                        messageId: 'useStylesString',
                        fix: (fixer) => {
                            return fixer.replaceText(node, utils_1.ASTUtils.isStringLiteral(el)
                                ? el.raw
                                : context.sourceCode.getText(el));
                        },
                    });
                },
                [singleStyleUrlsProperty](node) {
                    // The selector ensures the value is an array with a single non-null element.
                    const el = node.value.elements[0];
                    context.report({
                        node,
                        messageId: 'useStyleUrl',
                        fix: (fixer) => {
                            return fixer.replaceText(node, utils_1.ASTUtils.isStringLiteral(el)
                                ? `styleUrl: ${el.raw}`
                                : `styleUrl: ${context.sourceCode.getText(el)}`);
                        },
                    });
                },
            };
        }
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Consistency in how styles are declared makes codebases easier to navigate and maintain. When some components use styleUrl while others use styleUrls, or when styles are sometimes arrays and sometimes strings, it becomes harder for developers to predict what they'll find when opening a component. This rule enforces a consistent pattern across your codebase. Angular 17+ introduced the singular styleUrl property alongside the existing styleUrls array for common cases where components have only one stylesheet. Choosing one approach and sticking with it reduces cognitive load and makes the codebase feel more cohesive.",
};
