"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const unwrap_parenthesized_expression_1 = require("../utils/unwrap-parenthesized-expression");
exports.RULE_NAME = 'conditional-complexity';
const DEFAULT_MAX_COMPLEXITY = 5;
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'The conditional complexity should not exceed a rational limit',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    maxComplexity: {
                        minimum: 1,
                        type: 'number',
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            conditionalComplexity: 'The conditional complexity {{totalComplexity}} exceeds the defined limit {{maxComplexity}}',
        },
    },
    defaultOptions: [{ maxComplexity: DEFAULT_MAX_COMPLEXITY }],
    create(context, [{ maxComplexity }]) {
        (0, utils_1.ensureTemplateParser)(context);
        const sourceCode = context.sourceCode;
        return {
            BoundAttribute(node) {
                if (!node.value.source ||
                    !node.valueSpan ||
                    node.value.ast instanceof bundled_angular_compiler_1.Interpolation) {
                    return;
                }
                const possibleBinary = extractPossibleBinaryOrConditionalFrom(getParser().parseBinding(node.value.source, node.valueSpan, 0).ast);
                const totalComplexity = getTotalComplexity(possibleBinary);
                if (totalComplexity <= maxComplexity) {
                    return;
                }
                const { sourceSpan: { start, end }, } = node.value;
                context.report({
                    loc: {
                        start: sourceCode.getLocFromIndex(start),
                        end: sourceCode.getLocFromIndex(end),
                    },
                    messageId: 'conditionalComplexity',
                    data: { maxComplexity, totalComplexity },
                });
            },
            Interpolation({ expressions }) {
                for (const expression of expressions) {
                    const totalComplexity = getTotalComplexity(expression);
                    if (totalComplexity <= maxComplexity) {
                        continue;
                    }
                    const { sourceSpan: { start, end }, } = expression;
                    context.report({
                        loc: {
                            start: sourceCode.getLocFromIndex(start),
                            end: sourceCode.getLocFromIndex(end),
                        },
                        messageId: 'conditionalComplexity',
                        data: { maxComplexity, totalComplexity },
                    });
                }
            },
        };
    },
});
function extractPossibleBinaryOrConditionalFrom(node) {
    const unwrapped = (0, unwrap_parenthesized_expression_1.unwrapParenthesizedExpression)(node);
    return unwrapped instanceof bundled_angular_compiler_1.BindingPipe ? unwrapped.exp : unwrapped;
}
let parser = null;
// Instantiate the `Parser` class lazily only when this rule is applied.
function getParser() {
    return parser || (parser = new bundled_angular_compiler_1.Parser(new bundled_angular_compiler_1.Lexer()));
}
function getTotalComplexity(ast) {
    const possibleBinaryOrConditional = extractPossibleBinaryOrConditionalFrom(ast);
    if (!(possibleBinaryOrConditional instanceof bundled_angular_compiler_1.Binary ||
        possibleBinaryOrConditional instanceof bundled_angular_compiler_1.Conditional)) {
        return 0;
    }
    let total = 1;
    if (possibleBinaryOrConditional instanceof bundled_angular_compiler_1.Binary) {
        const leftUnwrapped = (0, unwrap_parenthesized_expression_1.unwrapParenthesizedExpression)(possibleBinaryOrConditional.left);
        const rightUnwrapped = (0, unwrap_parenthesized_expression_1.unwrapParenthesizedExpression)(possibleBinaryOrConditional.right);
        if (leftUnwrapped instanceof bundled_angular_compiler_1.Binary ||
            leftUnwrapped instanceof bundled_angular_compiler_1.Conditional) {
            total += getTotalComplexity(possibleBinaryOrConditional.left);
        }
        if (rightUnwrapped instanceof bundled_angular_compiler_1.Binary ||
            rightUnwrapped instanceof bundled_angular_compiler_1.Conditional) {
            total += getTotalComplexity(possibleBinaryOrConditional.right);
        }
    }
    if (possibleBinaryOrConditional instanceof bundled_angular_compiler_1.Conditional) {
        total +=
            getTotalComplexity(possibleBinaryOrConditional.condition) +
                getTotalComplexity(possibleBinaryOrConditional.trueExp) +
                getTotalComplexity(possibleBinaryOrConditional.falseExp);
    }
    return total;
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "Complex conditional expressions in templates (like multiple '&&' or '||' operators, nested ternaries, or long chains of conditions) make templates hard to read, test, and maintain. Template logic should be minimal and easy to understand at a glance. Complex conditionals are better moved to the component class as computed properties or methods, where they can be properly tested, documented, and reasoned about. For example, instead of '*ngIf=\"user && user.role === 'admin' && user.isActive && !user.isLocked\"', create a component property like 'get canAccessAdmin() { return this.user?.role === 'admin' && this.user?.isActive && !this.user?.isLocked; }' and use '*ngIf=\"canAccessAdmin\"'. This makes templates more declarative and components easier to unit test.",
};
