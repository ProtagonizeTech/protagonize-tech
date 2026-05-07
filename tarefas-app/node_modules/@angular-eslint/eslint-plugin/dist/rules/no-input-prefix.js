"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-input-prefix';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that input bindings, including aliases, are not named or prefixed by the configured disallowed prefixes',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    prefixes: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            noInputPrefix: 'Input bindings, including aliases, should not be named, nor prefixed by {{prefixes}}',
        },
    },
    defaultOptions: [{ prefixes: [] }],
    create(context, [{ prefixes }]) {
        return {
            [utils_1.Selectors.INPUT_PROPERTY_OR_SETTER](node) {
                const rawPropertyName = utils_1.ASTUtils.getRawText(node);
                // The child that matched was just a literal initializer of a property definition
                if (node.parent?.type === utils_2.TSESTree.AST_NODE_TYPES.PropertyDefinition) {
                    const initializingValue = node.parent.value;
                    if (initializingValue?.type === utils_2.TSESTree.AST_NODE_TYPES.Literal &&
                        rawPropertyName === utils_1.ASTUtils.getRawText(initializingValue) &&
                        node.range[0] === initializingValue.range[0] &&
                        node.range[1] === initializingValue.range[1]) {
                        return;
                    }
                }
                const hasDisallowedPrefix = prefixes.some((prefix) => isDisallowedPrefix(prefix, rawPropertyName));
                // Direct violation on the property name
                if (hasDisallowedPrefix) {
                    context.report({
                        node,
                        messageId: 'noInputPrefix',
                        data: {
                            prefixes: (0, utils_1.toHumanReadableText)(prefixes),
                        },
                    });
                }
                // Check if decorator alias has a violation
                let aliasProperty;
                if (!node.parent) {
                    return;
                }
                const inputDecorator = utils_1.ASTUtils.getDecorator(node.parent, 'Input');
                if (inputDecorator &&
                    utils_1.ASTUtils.isCallExpression(inputDecorator.expression)) {
                    // Angular 16+ alias property syntax
                    aliasProperty = utils_1.ASTUtils.getDecoratorPropertyValue(inputDecorator, 'alias');
                    let aliasValue = '';
                    let aliasArg;
                    if (aliasProperty) {
                        aliasValue = utils_1.ASTUtils.getRawText(aliasProperty);
                    }
                    else if (inputDecorator.expression.arguments.length > 0 &&
                        (utils_1.ASTUtils.isLiteral(inputDecorator.expression.arguments[0]) ||
                            utils_1.ASTUtils.isTemplateLiteral(inputDecorator.expression.arguments[0]))) {
                        aliasArg = inputDecorator.expression.arguments[0];
                        aliasValue = utils_1.ASTUtils.getRawText(aliasArg);
                    }
                    const hasDisallowedPrefix = prefixes.some((prefix) => isDisallowedPrefix(prefix, aliasValue));
                    if (!hasDisallowedPrefix) {
                        return;
                    }
                    return context.report({
                        node: aliasProperty || aliasArg || node,
                        messageId: 'noInputPrefix',
                        data: {
                            prefixes: (0, utils_1.toHumanReadableText)(prefixes),
                        },
                    });
                }
            },
            [utils_1.Selectors.INPUTS_METADATA_PROPERTY_LITERAL](node) {
                const [propertyName, aliasName] = utils_1.ASTUtils.getRawText(node)
                    .replace(/\s/g, '')
                    .split(':');
                const hasDisallowedPrefix = prefixes.some((prefix) => isDisallowedPrefix(prefix, propertyName, aliasName));
                if (!hasDisallowedPrefix) {
                    return;
                }
                context.report({
                    node,
                    messageId: 'noInputPrefix',
                    data: {
                        prefixes: (0, utils_1.toHumanReadableText)(prefixes),
                    },
                });
            },
        };
    },
});
function isDisallowedPrefix(prefix, propertyName, aliasName = '') {
    const prefixPattern = new RegExp(`^${prefix}(([^a-z])|(?=$))`);
    return prefixPattern.test(propertyName) || prefixPattern.test(aliasName);
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "In HTML and Angular templates, attributes don't use prefixes like 'is' or 'has', so input properties shouldn't either. For example, prefer '@Input() disabled' over '@Input() isDisabled', so it's used in templates as '[disabled]=\"true\"' rather than '[isDisabled]=\"true\"'. This creates a more natural, HTML-like API for your components and follows Angular's style guide. The component class can still use prefixed names internally, but the input binding name (the public API) should follow HTML conventions.",
};
