"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-any';
const ANY_TYPE_CAST_FUNCTION_NAME = '$any';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `The use of "${ANY_TYPE_CAST_FUNCTION_NAME}" nullifies the compile-time benefits of Angular's type system`,
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            noAny: `Avoid using "${ANY_TYPE_CAST_FUNCTION_NAME}" in templates`,
            suggestRemoveAny: `Remove ${ANY_TYPE_CAST_FUNCTION_NAME}`,
        },
    },
    defaultOptions: [],
    create(context) {
        (0, utils_1.ensureTemplateParser)(context);
        const sourceCode = context.sourceCode;
        const isAnyCall = (node) => {
            if (!(node.receiver instanceof bundled_angular_compiler_1.PropertyRead)) {
                return false;
            }
            if (node.receiver.name !== ANY_TYPE_CAST_FUNCTION_NAME) {
                return false;
            }
            if (!(
            // this.$any() is also valid usage of the native Angular $any()
            (node.receiver.receiver instanceof bundled_angular_compiler_1.ThisReceiver ||
                node.receiver.receiver instanceof bundled_angular_compiler_1.ImplicitReceiver))) {
                return false;
            }
            return true;
        };
        const reportAnyCall = (node) => {
            const { start, end } = node.sourceSpan;
            const nameSpan = node.receiver.nameSpan;
            context.report({
                messageId: 'noAny',
                loc: {
                    start: sourceCode.getLocFromIndex(start),
                    end: sourceCode.getLocFromIndex(end),
                },
                suggest: [
                    {
                        messageId: 'suggestRemoveAny',
                        fix: (fixer) => [
                            fixer.removeRange([nameSpan.start, nameSpan.end + 1]),
                            fixer.removeRange([end - 1, end]),
                        ],
                    },
                ],
            });
        };
        /**
         * Handles KeyedRead.KeyedRead cases like
         * $any(attributeList)['NPSScore']['another']
         */
        const findAndReportAnyCalls = (node) => {
            if (node instanceof bundled_angular_compiler_1.Call && isAnyCall(node)) {
                reportAnyCall(node);
            }
            else if (node instanceof bundled_angular_compiler_1.KeyedRead) {
                findAndReportAnyCalls(node.receiver);
            }
        };
        return {
            [`Call[receiver.name="${ANY_TYPE_CAST_FUNCTION_NAME}"]`](node) {
                if (!isAnyCall(node)) {
                    return;
                }
                reportAnyCall(node);
            },
            KeyedRead(node) {
                findAndReportAnyCalls(node);
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "The $any() type cast function in Angular templates disables TypeScript's type checking for an expression, removing all the benefits of static typing. This means typos, incorrect property access, and invalid method calls won't be caught until runtime. While $any() can be a quick fix for type errors, it's better to properly type your component properties or fix the underlying type issue. Overusing $any() makes templates less safe and can hide real bugs. If you're using $any() frequently, it often indicates that your component's types need improvement. Use $any() sparingly and only when you have a specific reason why TypeScript's type checking isn't applicable.",
};
