"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const are_equivalent_asts_1 = require("../utils/are-equivalent-asts");
const ast_types_1 = require("../utils/ast-types");
const to_range_1 = require("../utils/to-range");
exports.RULE_NAME = 'prefer-at-else';
const OPPOSITE_OPERATORS = new Map([
    ['', '!'],
    ['!', ''],
    ['<', '>='],
    ['>', '<='],
    ['<=', '>'],
    ['>=', '<'],
    ['==', '!='],
    ['!=', '=='],
    ['===', '!=='],
    ['!==', '==='],
]);
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
            description: 'Prefer using `@else` instead of a second `@if` with the opposite condition to reduce code and make it easier to read.',
        },
        schema: [],
        messages: {
            preferAtElse: 'Prefer using `@else` instead of a second `@if` clause.',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const previousNodeStack = [undefined];
        function getFix(previous, current) {
            const previousIf = previous.node.branches[0];
            const currentIf = current.node.branches[0];
            const currentElse = current.node.branches.at(1);
            const previousElse = previous.node.branches.at(1);
            // If the current `@if` block uses an alias, then
            // we won't fix it because the alias won't exist
            // in the `@else` block of the previous `@if` block.
            if (currentIf.expressionAlias) {
                return null;
            }
            return function* fix(fixer) {
                if (!previousElse) {
                    // The previous `@if` block has no `@else` block,
                    // so we can turn the current `@if` block into one.
                    yield fixer.replaceTextRange([
                        currentIf.sourceSpan.start.offset,
                        currentIf.startSourceSpan.end.offset,
                    ], '@else {');
                }
                else {
                    // The previous `@if` block already has an `@else` block.
                    // Since the current `@if` block is the opposite of the previous
                    // `@if` block, the previous `@else` block and the current `@if`
                    // block would both be rendered. We can achieve the same result
                    // with a single block by putting the contents of the current
                    // `@if` block at the end of the previous `@else` block.
                    const ifContents = context.sourceCode.text.slice(currentIf.startSourceSpan.end.offset, currentIf.sourceSpan.end.offset - 1);
                    yield fixer.insertTextAfterRange((0, to_range_1.toZeroLengthRange)(previousElse.sourceSpan.end.offset - 1), ifContents);
                    yield fixer.removeRange((0, to_range_1.toRange)(currentIf.sourceSpan));
                }
                if (currentElse && currentIf.endSourceSpan) {
                    // The current node has an `@else` block. Since the current
                    // `@if` block is the opposite of the previous `@if` block,
                    // the `@else` block would be rendered when the previous
                    // `@if` is also rendered. We can achieve the same result
                    // by putting the contents of the current `@else` block
                    // at the end of the previous `@if` block.
                    const elseContents = context.sourceCode.text.slice(currentElse.startSourceSpan.end.offset, currentElse.sourceSpan.end.offset - 1);
                    yield fixer.insertTextAfterRange((0, to_range_1.toZeroLengthRange)(previousIf.sourceSpan.end.offset - 1), elseContents);
                    yield fixer.removeRange([
                        currentIf.endSourceSpan.end.offset,
                        currentElse.sourceSpan.end.offset,
                    ]);
                }
            };
        }
        return {
            // We need to visit `@if` blocks, but we also
            // need to know if there are any nodes immediately
            // before them, so we need to visit all nodes.
            '*'(node) {
                const current = getIfNodeInfo(node);
                if (current) {
                    const previous = previousNodeStack.at(-1);
                    if (previous && canCombine(previous, current)) {
                        context.report({
                            loc: parserServices.convertNodeSourceSpanToLoc(current.node.nameSpan),
                            messageId: 'preferAtElse',
                            fix: getFix(previous, current),
                        });
                    }
                }
                // Record this current node as the previous node so that
                // we can get the info when we look at the next sibling.
                previousNodeStack[previousNodeStack.length - 1] = current;
                // We are about to visit the children of this node,
                // so push a new "previous node info" onto the stack.
                // The previous node of the first child is undefined.
                previousNodeStack.push(undefined);
            },
            '*:exit'() {
                // We've finished visiting the children of this node,
                // so pop the "previous node info" off the stack.
                previousNodeStack.pop();
            },
        };
    },
});
function getIfNodeInfo(node) {
    // We only care about `@if` blocks with one or two branches.
    // Any more branches and it would have to contain an
    // `@else if` branch, which we cannot handle.
    if (node instanceof bundled_angular_compiler_1.TmplAstIfBlock &&
        node.branches.length >= 1 &&
        node.branches[0].expression instanceof bundled_angular_compiler_1.ASTWithSource &&
        node.branches.length <= 2) {
        // When there are two branches, the second
        // branch cannot have an expression, otherwise it
        // would be an `@else if` block, which we cannot
        // combine with a previous or next `@if` block.
        if (node.branches.length == 1 || !node.branches[1].expression) {
            const ast = node.branches[0].expression.ast;
            if (ast instanceof bundled_angular_compiler_1.Binary) {
                return { node, lhs: ast.left, rhs: ast.right, operator: ast.operation };
            }
            if (ast instanceof bundled_angular_compiler_1.PrefixNot) {
                return { node, lhs: ast.expression, rhs: undefined, operator: '!' };
            }
            return { node, lhs: ast, rhs: undefined, operator: '' };
        }
    }
    return undefined;
}
function canCombine(previous, current) {
    if (OPPOSITE_OPERATORS.get(previous.operator) === current.operator) {
        if ((0, are_equivalent_asts_1.areEquivalentASTs)(previous.lhs, current.lhs)) {
            if (previous.rhs === undefined && current.rhs === undefined) {
                return true;
            }
            if (previous.rhs &&
                current.rhs &&
                (0, are_equivalent_asts_1.areEquivalentASTs)(previous.rhs, current.rhs)) {
                return true;
            }
        }
    }
    // Arrays cannot have a length less than zero, so there is
    // a special case we can look for. If the previous node
    // was an "is empty" and the current node is "is not empty"
    // (or vice versa), then we can consider them opposites.
    if ((isEmptyLength(previous) && isNonEmptyLength(current)) ||
        (isNonEmptyLength(previous) && isEmptyLength(current))) {
        return true;
    }
    return false;
}
function isEmptyLength(node) {
    if (node.rhs !== undefined) {
        if (node.operator === '==' || node.operator === '===') {
            if ((0, ast_types_1.isLengthRead)(node.lhs) && (0, ast_types_1.isZero)(node.rhs)) {
                return true;
            }
            if ((0, ast_types_1.isZero)(node.lhs) && (0, ast_types_1.isLengthRead)(node.rhs)) {
                return true;
            }
        }
    }
    return false;
}
function isNonEmptyLength(node) {
    if (node.rhs !== undefined) {
        // We don't need to check for the inequality operators because
        // they would be handled by the standard "are opposite" check.
        if ((0, ast_types_1.isLengthRead)(node.lhs) && node.operator === '>' && (0, ast_types_1.isZero)(node.rhs)) {
            return true;
        }
        if ((0, ast_types_1.isZero)(node.lhs) && node.operator === '<' && (0, ast_types_1.isLengthRead)(node.rhs)) {
            return true;
        }
    }
    return false;
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'When two consecutive @if blocks test opposite conditions (like @if (isLoggedIn) and @if (!isLoggedIn)), the second should be replaced with @else for clarity and maintainability. Using @else makes it immediately obvious that exactly one of the two branches will execute, whereas two separate @if statements require readers to mentally verify that the conditions are opposites. The @else pattern is more concise, eliminates duplication, and prevents bugs that could occur if the conditions drift out of sync during maintenance. This rule automatically detects opposite conditions including negation (!), comparison operators (<, >, ==, !=, etc.), and special cases like array.length === 0 versus array.length > 0.',
};
