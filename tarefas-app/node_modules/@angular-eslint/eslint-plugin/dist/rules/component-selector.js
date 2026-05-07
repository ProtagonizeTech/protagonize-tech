"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'component-selector';
const VIEW_ENCAPSULATION_SHADOW_DOM = 'ShadowDom';
const VIEW_ENCAPSULATION = 'ViewEncapsulation';
const STYLE_GUIDE_LINK = 'https://angular.dev/style-guide#choosing-component-selectors';
const SHADOW_DOM_ENCAPSULATED_STYLE_LINK = 'https://github.com/angular-eslint/angular-eslint/issues/534';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Component selectors should follow given naming rules. See more at ${STYLE_GUIDE_LINK}.`,
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
            prefixFailure: `The selector should start with one of these prefixes: {{prefix}} (${STYLE_GUIDE_LINK})`,
            styleFailure: `The selector should be {{style}} (${STYLE_GUIDE_LINK})`,
            styleAndPrefixFailure: `The selector should be {{style}} and start with one of these prefixes: {{prefix}} (${STYLE_GUIDE_LINK} and ${STYLE_GUIDE_LINK})`,
            typeFailure: `The selector should be used as an {{type}} (${STYLE_GUIDE_LINK})`,
            shadowDomEncapsulatedStyleFailure: `The selector of a ShadowDom-encapsulated component should be \`${utils_1.ASTUtils.OPTION_STYLE_KEBAB_CASE}\` (${SHADOW_DOM_ENCAPSULATED_STYLE_LINK})`,
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
            [utils_1.Selectors.COMPONENT_CLASS_DECORATOR](node) {
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
                // Override `style` for ShadowDom-encapsulated components. See https://github.com/angular-eslint/angular-eslint/issues/534.
                const overrideStyle = style !== utils_1.ASTUtils.OPTION_STYLE_KEBAB_CASE &&
                    hasEncapsulationShadowDomProperty(node)
                    ? utils_1.ASTUtils.OPTION_STYLE_KEBAB_CASE
                    : style;
                const hasExpectedSelector = utils_1.SelectorUtils.checkSelector(rawSelectors, type, prefix, overrideStyle, parsedSelectors);
                if (hasExpectedSelector === null) {
                    return;
                }
                // Special check for ShadowDom-encapsulated components
                // They must have a hyphen in the selector (e.g., 'app-selector' not 'appSelector')
                const isShadowDom = style !== overrideStyle;
                if (isShadowDom) {
                    // For ShadowDom components, check if any selector contains a hyphen
                    // We need to check the raw selector values from parsedSelectors
                    const hasHyphen = parsedSelectors.some((selector) => {
                        // Check if the element selector contains a hyphen
                        return selector.element && selector.element.includes('-');
                    });
                    if (!hasHyphen) {
                        context.report({
                            node: rawSelectors,
                            messageId: 'shadowDomEncapsulatedStyleFailure',
                        });
                        return;
                    }
                }
                // Component-specific validation logic (includes styleAndPrefixFailure)
                if (!hasExpectedSelector.hasExpectedType) {
                    utils_1.SelectorUtils.reportTypeError(rawSelectors, type, context);
                }
                else if (!hasExpectedSelector.hasSelectorAfterPrefix) {
                    // Only report selector after prefix error if prefix is actually required
                    if (prefix !== undefined) {
                        const prefixArray = (0, utils_1.arrayify)(prefix);
                        if (prefixArray.length > 0) {
                            utils_1.SelectorUtils.reportSelectorAfterPrefixError(rawSelectors, prefix, context);
                        }
                    }
                }
                else if (!hasExpectedSelector.hasExpectedStyle) {
                    if (style === overrideStyle) {
                        if (!hasExpectedSelector.hasExpectedPrefix) {
                            if (prefix !== undefined) {
                                // Only report style and prefix error if prefix is actually required
                                utils_1.SelectorUtils.reportStyleAndPrefixError(rawSelectors, style, prefix, context);
                            }
                            else {
                                // If no prefix required, just report style error
                                utils_1.SelectorUtils.reportStyleError(rawSelectors, style, context);
                            }
                        }
                        else {
                            utils_1.SelectorUtils.reportStyleError(rawSelectors, style, context);
                        }
                    }
                    else {
                        context.report({
                            node: rawSelectors,
                            messageId: 'shadowDomEncapsulatedStyleFailure',
                        });
                    }
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
function hasEncapsulationShadowDomProperty(node) {
    const encapsulationValue = utils_1.ASTUtils.getDecoratorPropertyValue(node, 'encapsulation');
    return (encapsulationValue &&
        utils_1.ASTUtils.isMemberExpression(encapsulationValue) &&
        utils_2.ASTUtils.isIdentifier(encapsulationValue.object) &&
        encapsulationValue.object.name === VIEW_ENCAPSULATION &&
        utils_2.ASTUtils.isIdentifier(encapsulationValue.property) &&
        encapsulationValue.property.name === VIEW_ENCAPSULATION_SHADOW_DOM);
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "Consistent component selector naming conventions provide several benefits: they make components easily identifiable in templates and browser DevTools, prevent naming collisions with native HTML elements and third-party components, enable teams to quickly identify which library or feature area a component belongs to, and align with the Web Components specification for custom elements. For example, prefixing selectors with 'app-' (like 'app-user-profile') clearly distinguishes your application components from third-party libraries.",
};
