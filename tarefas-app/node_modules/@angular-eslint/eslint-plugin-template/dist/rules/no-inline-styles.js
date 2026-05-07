"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const DEFAULT_OPTIONS = {
    allowNgStyle: false,
    allowBindToStyle: false,
};
exports.RULE_NAME = 'no-inline-styles';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows the use of inline styles in HTML templates',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowNgStyle: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.allowNgStyle,
                    },
                    allowBindToStyle: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.allowBindToStyle,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            noInlineStyles: '<{{element}}/> element should not have inline styles via style attribute. Please use classes instead.',
        },
    },
    defaultOptions: [DEFAULT_OPTIONS],
    create(context, [{ allowNgStyle, allowBindToStyle }]) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        return {
            Element(node) {
                let isInvalid = false;
                if (!allowNgStyle && !allowBindToStyle) {
                    isInvalid =
                        isNodeHasStyleAttribute(node) ||
                            isNodeHasNgStyleAttribute(node) ||
                            isNodeHasBindingToStyleAttribute(node);
                }
                else {
                    const ngStyle = allowNgStyle
                        ? false
                        : isNodeHasNgStyleAttribute(node);
                    const bindToStyle = allowBindToStyle
                        ? false
                        : isNodeHasBindingToStyleAttribute(node);
                    isInvalid = isNodeHasStyleAttribute(node) || ngStyle || bindToStyle;
                }
                if (isInvalid) {
                    const loc = parserServices.convertElementSourceSpanToLoc(context, node);
                    context.report({
                        loc,
                        messageId: 'noInlineStyles',
                        data: {
                            element: node.name,
                        },
                    });
                }
            },
        };
    },
});
/**
 *  Check that an element (for example `<img>`) has a `style` attribute or `attr.style` binding.
 */
function isNodeHasStyleAttribute(node) {
    return (node.attributes.some(({ name }) => isStyle(name)) ||
        node.inputs.some(({ name }) => isStyle(name)));
}
/**
 *  Check that an element (for example `<img>`) has a `ngStyle` attribute binding.
 */
function isNodeHasNgStyleAttribute(node) {
    return node.inputs.some(({ name }) => isNgStyle(name));
}
/**
 *  Check that an element (for example `<img>`) has a `[style.background-color]` attribute binding.
 */
function isNodeHasBindingToStyleAttribute(node) {
    return node.inputs.some(({ keySpan }) => isStyleBound(keySpan));
}
/**
 *  Check element is style
 */
function isStyle(name) {
    return name === 'style';
}
function isNgStyle(name) {
    return name === 'ngStyle';
}
function isStyleBound(keySpan) {
    return keySpan?.details ? keySpan.details.includes('style.') : false;
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Inline styles in templates (style attribute, ngStyle directive, or [style.property] bindings) make it difficult to maintain consistent styling across an application and can violate Content Security Policy (CSP) restrictions. Styles should be defined in component stylesheets or CSS classes where they can be managed centrally, reused, cached by browsers, and easily modified. Inline styles also mix presentation concerns with template structure, making templates harder to read. Using CSS classes with [class] or [ngClass] bindings provides the same dynamic styling capabilities while keeping styles organized and maintainable. This rule can be configured to allow ngStyle or style bindings if needed for specific use cases.',
};
