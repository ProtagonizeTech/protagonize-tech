"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-empty-control-flow';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: "Ensures that control flow blocks are not empty. Empty control flow blocks usually occur due to refactoring that wasn't completed. They can cause confusion when reading code.",
        },
        schema: [],
        messages: {
            noEmptyControlFlow: 'Unexpected empty control flow block.',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        return {
            'ForLoopBlockEmpty,IfBlockBranch,SwitchBlockCase'(node) {
                if (node.children.length === 0 ||
                    isEmpty(node.startSourceSpan.end, node.endSourceSpan?.start)) {
                    report(node);
                }
            },
            ForLoopBlock(node) {
                if (node.children.length === 0 ||
                    // Like other block nodes, the start source span covers the opening
                    // `@for (...) {` part, but the end source span is the closing `}`
                    // at the end of the entire block, which might be after the `@empty {`
                    // part. The main block span ends at the `}` that ends the content of
                    // the `@for` block before the `@empty` block. Because it includes
                    // the closing brace, we need to move it back by one.
                    isEmpty(node.startSourceSpan.end, node.mainBlockSpan.end.moveBy(-1))) {
                    report(node);
                }
            },
            SwitchBlock(node) {
                // A switch block is pointless without cases, so
                // if there are no cases, don't bother checking
                // if there's non-whitespace characters within it.
                if (node.cases.length === 0) {
                    report(node);
                }
            },
        };
        function isEmpty(contentStart, contentEnd) {
            return (!!contentEnd &&
                context.sourceCode.text
                    .slice(contentStart.offset, contentEnd.offset)
                    .trim() === '');
        }
        function report(node) {
            context.report({
                messageId: 'noEmptyControlFlow',
                loc: parserServices.convertNodeSourceSpanToLoc(node.nameSpan),
            });
        }
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Empty control flow blocks (@if, @else, @for, @switch, @case, @empty) usually indicate incomplete refactoring or code that was commented out or deleted but left the block structure behind. These empty blocks add no functionality but create visual noise and confusion when reading templates. Developers may wonder whether the empty block is intentional or a bug. Removing empty blocks keeps templates clean and makes it clear that there is no conditional logic or looping in that location. This rule helps maintain template quality and catches likely mistakes during development.',
};
