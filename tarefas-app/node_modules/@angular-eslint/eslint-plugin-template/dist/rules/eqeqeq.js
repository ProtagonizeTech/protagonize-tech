"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_nearest_node_from_1 = require("../utils/get-nearest-node-from");
const literal_primitive_1 = require("../utils/literal-primitive");
exports.RULE_NAME = 'eqeqeq';
const DEFAULT_OPTIONS = { allowNullOrUndefined: false };
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: 'eqeqeq',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Requires `===` and `!==` in place of `==` and `!=`',
            recommended: 'recommended',
        },
        hasSuggestions: true,
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    allowNullOrUndefined: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.allowNullOrUndefined,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            eqeqeq: 'Expected `{{expectedOperation}}` but received `{{actualOperation}}`',
            suggestStrictEquality: 'Replace `{{actualOperation}}` with `{{expectedOperation}}`',
        },
    },
    defaultOptions: [DEFAULT_OPTIONS],
    create(context, [{ allowNullOrUndefined }]) {
        (0, utils_1.ensureTemplateParser)(context);
        const sourceCode = context.sourceCode;
        return {
            'Binary[operation=/^(==|!=)$/]'(node) {
                const { left, operation, right, sourceSpan: { start, end }, } = node;
                if (allowNullOrUndefined && (isNilValue(left) || isNilValue(right))) {
                    return;
                }
                const data = {
                    actualOperation: operation,
                    expectedOperation: `${operation}=`,
                };
                context.report({
                    loc: {
                        start: sourceCode.getLocFromIndex(start),
                        end: sourceCode.getLocFromIndex(end),
                    },
                    messageId: 'eqeqeq',
                    data,
                    ...(isStringNonNumericValue(left) || isStringNonNumericValue(right)
                        ? {
                            fix: (fixer) => getFix({ node, right, end, sourceCode, fixer }),
                        }
                        : {
                            suggest: [
                                {
                                    messageId: 'suggestStrictEquality',
                                    fix: (fixer) => getFix({ node, right, end, sourceCode, fixer }),
                                    data,
                                },
                            ],
                        }),
                });
            },
        };
    },
});
function getSpanLength({ span: { start, end } }) {
    return end - start;
}
const getFix = ({ node, right, end, sourceCode, fixer, }) => {
    const { source, ast } = (0, get_nearest_node_from_1.getNearestNodeFrom)(node, isASTWithSource);
    if (!source)
        return null;
    let startOffset = 0;
    while (!isInterpolation(ast) && isLeadingTriviaChar(source[startOffset])) {
        startOffset++;
    }
    const endRange = end - startOffset - getSpanLength(right) - 1;
    let eqOffset = 0;
    while (sourceCode.text[endRange - eqOffset] !== '=') {
        eqOffset++;
    }
    return fixer.insertTextAfterRange([endRange - eqOffset, endRange - eqOffset], '=');
};
function isLeadingTriviaChar(char) {
    return char === '\n' || char === ' ';
}
function isASTWithSource(node) {
    return node instanceof bundled_angular_compiler_1.ASTWithSource;
}
function isInterpolation(node) {
    return node instanceof bundled_angular_compiler_1.Interpolation;
}
function isNumeric(value) {
    return (!Number.isNaN(Number.parseFloat(String(value))) &&
        Number.isFinite(Number(value)));
}
function isStringNonNumericValue(ast) {
    return (0, literal_primitive_1.isStringLiteralPrimitive)(ast) && !isNumeric(ast.value);
}
function isNilValue(ast) {
    return ((0, literal_primitive_1.isLiteralPrimitive)(ast) && (ast.value === null || ast.value === undefined));
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'The == and != operators perform type coercion before comparison, which can lead to unexpected and confusing results. For example, "0" == 0 is true, [] == false is true, and null == undefined is true. These implicit conversions make code harder to understand and can hide bugs. The strict equality operators === and !== compare both value and type without coercion, making comparisons predictable and explicit. This is a widely accepted JavaScript/TypeScript best practice that Angular templates should follow for consistency with TypeScript code. The rule can optionally allow == and != when comparing to null or undefined, as this is a common pattern for checking if a value exists.',
};
