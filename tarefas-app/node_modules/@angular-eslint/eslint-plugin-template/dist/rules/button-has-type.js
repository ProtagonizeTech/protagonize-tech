"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.INVALID_TYPE_DATA_KEY = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'button-has-type';
const DEFAULT_OPTIONS = {
    ignoreWithDirectives: [],
};
exports.INVALID_TYPE_DATA_KEY = 'type';
// https://www.w3.org/TR/html401/interact/forms.html#adef-type-BUTTON
const VALID_BUTTON_TYPES = ['button', 'submit', 'reset'];
const TYPE_ATTRIBUTE_NAME = 'type';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that a button has a valid type specified',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreWithDirectives: {
                        type: 'array',
                        items: { type: 'string' },
                        uniqueItems: true,
                        default: DEFAULT_OPTIONS.ignoreWithDirectives,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            missingType: 'Type for <button> is missing',
            invalidType: `"{{${exports.INVALID_TYPE_DATA_KEY}}}" can not be used as a type for <button>`,
        },
    },
    defaultOptions: [{}],
    create(context, [{ ignoreWithDirectives }]) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        return {
            [`Element[name=/^(button)$/i]`](element) {
                if (!isTypeAttributePresentInElement(element)) {
                    if (!isIgnored(ignoreWithDirectives, element)) {
                        context.report({
                            loc: parserServices.convertNodeSourceSpanToLoc(element.sourceSpan),
                            messageId: 'missingType',
                        });
                    }
                }
                const invalidTypeInfo = getInvalidButtonTypeIfPresent(element);
                if (invalidTypeInfo != null) {
                    context.report({
                        loc: parserServices.convertNodeSourceSpanToLoc(invalidTypeInfo.sourceSpan),
                        messageId: 'invalidType',
                        data: {
                            [exports.INVALID_TYPE_DATA_KEY]: invalidTypeInfo.value,
                        },
                    });
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Buttons default to `type="submit"` when no type is specified. If placed inside a form, the button triggers a form submission on click. Enforcing the type attribute clarifies the code\'s intent and prevents unintended form submissions.',
};
function isTypeAttributePresentInElement({ inputs, attributes, }) {
    return [...inputs, ...attributes].some(({ name }) => name === TYPE_ATTRIBUTE_NAME);
}
function isIgnored(ignoreWithDirectives, { inputs, attributes }) {
    if (ignoreWithDirectives && ignoreWithDirectives.length > 0) {
        for (const input of inputs) {
            if (ignoreWithDirectives.includes(input.name)) {
                return true;
            }
        }
        for (const attribute of attributes) {
            if (ignoreWithDirectives.includes(attribute.name)) {
                return true;
            }
        }
    }
    return false;
}
function getInvalidButtonTypeIfPresent(element) {
    const invalidTextAttribute = element.attributes.find(({ name, value }) => name === TYPE_ATTRIBUTE_NAME && !VALID_BUTTON_TYPES.includes(value));
    if (invalidTextAttribute) {
        return {
            sourceSpan: invalidTextAttribute.sourceSpan,
            value: invalidTextAttribute.value,
        };
    }
    for (const { name, value, sourceSpan } of element.inputs) {
        // Intentionally ignore the property binding by looking for literal primitives only
        // in order to avoid type-checking for the property, e.g. check that it's 'submit', 'button', etc.
        if (name === TYPE_ATTRIBUTE_NAME &&
            value instanceof bundled_angular_compiler_1.ASTWithSource &&
            value.ast instanceof bundled_angular_compiler_1.LiteralPrimitive &&
            !VALID_BUTTON_TYPES.includes(value.ast.value)) {
            return {
                value: value.ast.value,
                sourceSpan,
            };
        }
    }
    return null;
}
