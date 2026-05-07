"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const aria_query_1 = require("aria-query");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const to_pattern_1 = require("../utils/to-pattern");
exports.RULE_NAME = 'valid-aria';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures that correct ARIA attributes and respective values are used',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            validAria: 'The `{{attribute}}` is an invalid ARIA attribute',
            validAriaValue: 'The `{{attribute}}` has an invalid value. Check the valid values at https://raw.githack.com/w3c/aria/stable/#roles',
            suggestRemoveInvalidAria: 'Remove attribute `{{attribute}}`',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const domElements = [...(0, get_dom_elements_1.getDomElements)()];
        const uppercaseDomElements = domElements.map((element) => element.toUpperCase());
        const elementNamePattern = (0, to_pattern_1.toPattern)([
            ...domElements,
            ...uppercaseDomElements,
        ]);
        return {
            [`Element[name=${elementNamePattern}] > :matches(BoundAttribute, TextAttribute)[name=/^aria-.+/]`](node) {
                const { name: attribute, sourceSpan } = node;
                const ariaPropertyDefinition = aria_query_1.aria.get(attribute);
                const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                if (!ariaPropertyDefinition) {
                    context.report({
                        loc,
                        messageId: 'validAria',
                        data: { attribute },
                        suggest: [
                            {
                                messageId: 'suggestRemoveInvalidAria',
                                data: { attribute },
                                fix: (fixer) => fixer.removeRange([
                                    sourceSpan.start.offset - 1,
                                    sourceSpan.end.offset,
                                ]),
                            },
                        ],
                    });
                    return;
                }
                const ast = extractASTFrom(node);
                if (canIgnoreNode(ast) ||
                    isValidAriaPropertyValue(ariaPropertyDefinition, ast.value)) {
                    return;
                }
                context.report({
                    loc,
                    messageId: 'validAriaValue',
                    data: { attribute },
                });
            },
        };
    },
});
function isLiteralCollection(ast) {
    return ast instanceof bundled_angular_compiler_1.LiteralArray || ast instanceof bundled_angular_compiler_1.LiteralMap;
}
function isPrimitive(ast) {
    return ast instanceof bundled_angular_compiler_1.LiteralPrimitive || ast instanceof bundled_angular_compiler_1.TmplAstTextAttribute;
}
function canIgnoreNode(ast) {
    return !isLiteralCollection(ast) && !isPrimitive(ast);
}
function extractASTFrom(attribute) {
    return attribute instanceof bundled_angular_compiler_1.TmplAstBoundAttribute &&
        attribute.value instanceof bundled_angular_compiler_1.ASTWithSource
        ? attribute.value.ast
        : attribute;
}
function isBooleanLike(value) {
    return typeof value === 'boolean' || value === 'false' || value === 'true';
}
function isInteger(value) {
    return (!Number.isNaN(value) &&
        parseInt(Number(value)) == value &&
        !Number.isNaN(parseInt(value, 10)));
}
function isNumeric(value) {
    return (!Number.isNaN(Number.parseFloat(value)) &&
        Number.isFinite(Number(value)));
}
function isNil(value) {
    return value == null;
}
function isString(value) {
    return typeof value == 'string';
}
function isMixed(value) {
    return isString(value) && value === 'mixed';
}
function isTristate(value) {
    return isMixed(value) || isBooleanLike(value) || isNil(value);
}
function isValidAriaPropertyValue({ allowundefined, type, values }, attributeValue) {
    if (allowundefined && isNil(attributeValue))
        return true;
    switch (type) {
        case 'boolean':
            return isBooleanLike(attributeValue);
        case 'tristate':
            return isTristate(attributeValue);
        case 'id':
        case 'idlist':
            return true;
        case 'integer':
            return isInteger(attributeValue);
        case 'number':
            return isNumeric(attributeValue);
        case 'string':
            return isString(attributeValue);
        case 'token':
        case 'tokenlist': {
            const parsedAttributeValue = isBooleanLike(attributeValue)
                ? JSON.parse(attributeValue)
                : attributeValue;
            return Boolean(values?.includes(parsedAttributeValue));
        }
    }
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "ARIA (Accessible Rich Internet Applications) attributes must be valid and used correctly for screen readers to interpret them. Using invalid or misspelled ARIA attributes (like 'aria-labeledby' instead of 'aria-labelledby', or using ARIA attributes that don't exist) causes screen readers to ignore them, breaking accessibility. Each HTML element only supports specific ARIA attributes based on its role. Invalid ARIA is worse than no ARIA because it gives developers false confidence that they've made something accessible when they haven't. Use a reference like the ARIA specification or MDN to verify attribute names and valid usage.",
};
