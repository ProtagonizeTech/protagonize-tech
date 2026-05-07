"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'directive-selector';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Directive selectors should follow given naming rules. See more at https://angular.dev/style-guide#choosing-directive-selectors.',
        },
        schema: [
            {
                oneOf: [
                    // Single config object
                    {
                        type: 'object',
                        properties: {
                            type: {
                                oneOf: [
                                    { type: 'string' },
                                    {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            enum: [
                                                utils_1.SelectorUtils.OPTION_TYPE_ELEMENT,
                                                utils_1.SelectorUtils.OPTION_TYPE_ATTRIBUTE,
                                            ],
                                        },
                                    },
                                ],
                            },
                            prefix: {
                                oneOf: [{ type: 'string' }, { type: 'array' }],
                            },
                            style: {
                                type: 'string',
                                enum: [
                                    utils_1.ASTUtils.OPTION_STYLE_CAMEL_CASE,
                                    utils_1.ASTUtils.OPTION_STYLE_KEBAB_CASE,
                                ],
                            },
                        },
                        required: ['type', 'style'],
                        additionalProperties: false,
                    },
                    // Array of 1-2 config objects
                    {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                type: {
                                    type: 'string',
                                    enum: [
                                        utils_1.SelectorUtils.OPTION_TYPE_ELEMENT,
                                        utils_1.SelectorUtils.OPTION_TYPE_ATTRIBUTE,
                                    ],
                                },
                                prefix: {
                                    oneOf: [{ type: 'string' }, { type: 'array' }],
                                },
                                style: {
                                    type: 'string',
                                    enum: [
                                        utils_1.ASTUtils.OPTION_STYLE_CAMEL_CASE,
                                        utils_1.ASTUtils.OPTION_STYLE_KEBAB_CASE,
                                    ],
                                },
                            },
                            additionalProperties: false,
                            required: ['type', 'style'],
                        },
                        minItems: 1,
                        maxItems: 2,
                    },
                ],
            },
        ],
        messages: {
            prefixFailure: 'The selector should start with one of these prefixes: {{prefix}}',
            styleFailure: 'The selector should be {{style}}',
            typeFailure: 'The selector should be used as an {{type}}',
            selectorAfterPrefixFailure: `There should be a selector after the {{prefix}} prefix`,
        },
    },
    defaultOptions: [
        {
            type: undefined,
            prefix: 'app', // Match default Angular CLI prefix
            style: undefined,
        },
    ],
    create(context, [options]) {
        // Options are required by schema, so if undefined, ESLint will throw an error
        if (!options) {
            return {};
        }
        // Normalize options to a consistent format using shared utility
        const configByType = utils_1.SelectorUtils.normalizeOptionsToConfigs(options);
        return {
            [utils_1.Selectors.DIRECTIVE_CLASS_DECORATOR](node) {
                const rawSelectors = utils_1.ASTUtils.getDecoratorPropertyValue(node, 'selector');
                if (!rawSelectors) {
                    return;
                }
                // Parse selectors once for reuse
                const parsedSelectors = utils_1.SelectorUtils.parseSelectorNode(rawSelectors);
                if (!parsedSelectors || parsedSelectors.length === 0) {
                    return;
                }
                const applicableConfig = utils_1.SelectorUtils.getApplicableConfig(rawSelectors, configByType);
                if (!applicableConfig) {
                    return;
                }
                const { type, prefix, style } = applicableConfig;
                const isValidOptions = utils_1.SelectorUtils.checkValidOptions(type, prefix, style);
                if (!isValidOptions) {
                    return;
                }
                const hasExpectedSelector = utils_1.SelectorUtils.checkSelector(rawSelectors, type, prefix, style, parsedSelectors);
                if (hasExpectedSelector === null) {
                    return;
                }
                // Directive-specific validation logic (simpler than component)
                if (!hasExpectedSelector.hasExpectedType) {
                    utils_1.SelectorUtils.reportTypeError(rawSelectors, type, context);
                }
                else if (!hasExpectedSelector.hasSelectorAfterPrefix) {
                    // Only report selector after prefix error if prefix is actually required
                    if (prefix !== undefined) {
                        utils_1.SelectorUtils.reportSelectorAfterPrefixError(rawSelectors, prefix, context);
                    }
                }
                else if (!hasExpectedSelector.hasExpectedStyle) {
                    utils_1.SelectorUtils.reportStyleError(rawSelectors, style, context);
                }
                else if (!hasExpectedSelector.hasExpectedPrefix) {
                    // Only report prefix error if prefix is actually required (not empty)
                    if (prefix !== undefined) {
                        const prefixArray = (0, utils_1.arrayify)(prefix);
                        if (prefixArray.length > 0) {
                            utils_1.SelectorUtils.reportPrefixError(rawSelectors, prefix, context);
                        }
                    }
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Consistent directive selector naming conventions help identify which directives belong to your application versus third-party libraries, prevent naming collisions with native HTML attributes and other directives, and make code reviews and debugging easier. For example, using a camelCase attribute selector with a prefix like 'appHighlight' makes it immediately clear that this is a custom directive from your application.",
};
