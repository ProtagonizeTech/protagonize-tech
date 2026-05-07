"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_nearest_node_from_1 = require("../utils/get-nearest-node-from");
const is_bound_event_1 = require("../utils/is-bound-event");
const is_ast_with_name_1 = require("../utils/is-ast-with-name");
exports.RULE_NAME = 'no-call-expression';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows calling expressions in templates, except for output handlers',
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    allowList: {
                        items: { type: 'string' },
                        type: 'array',
                        uniqueItems: true,
                    },
                    allowPrefix: { type: 'string' },
                    allowSuffix: { type: 'string' },
                },
                type: 'object',
            },
        ],
        messages: {
            noCallExpression: 'Avoid calling expressions in templates',
        },
    },
    defaultOptions: [
        { allowList: [], allowPrefix: undefined, allowSuffix: undefined },
    ],
    create(context, [{ allowList, allowPrefix, allowSuffix }]) {
        (0, utils_1.ensureTemplateParser)(context);
        const sourceCode = context.sourceCode;
        return {
            'Call[receiver.name!="$any"]'(node) {
                const isChildOfBoundEvent = Boolean((0, get_nearest_node_from_1.getNearestNodeFrom)(node, is_bound_event_1.isBoundEvent));
                if (isChildOfBoundEvent ||
                    isCallNameInAllowList(node.receiver, allowList)) {
                    return;
                }
                if (allowPrefix &&
                    (0, is_ast_with_name_1.isASTWithName)(node.receiver) &&
                    node.receiver.name.startsWith(allowPrefix)) {
                    return;
                }
                if (allowSuffix &&
                    (0, is_ast_with_name_1.isASTWithName)(node.receiver) &&
                    node.receiver.name.endsWith(allowSuffix)) {
                    return;
                }
                const { sourceSpan: { start, end }, } = node;
                context.report({
                    loc: {
                        start: sourceCode.getLocFromIndex(start),
                        end: sourceCode.getLocFromIndex(end),
                    },
                    messageId: 'noCallExpression',
                });
            },
        };
    },
});
function isCallNameInAllowList(ast, allowList) {
    return (allowList &&
        allowList.length > 0 &&
        (0, is_ast_with_name_1.isASTWithName)(ast) &&
        allowList.indexOf(ast.name) > -1);
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Calling functions or methods in Angular templates (like {{ formatDate(date) }} or *ngIf="isValid()") causes those functions to execute on every change detection cycle. In a typical application, change detection runs very frequently—on every user interaction, HTTP request, or timer event. If a function is called in a template that renders a list of 100 items, it might execute 100 times per change detection cycle, potentially thousands of times per second. This can cause severe performance problems. Instead, use component properties, pipes (which cache results), or computed signals (in modern Angular). For example, instead of {{ formatDate(date) }}, use {{ date | date }} or create a computed signal or getter that calculates the value once per change detection cycle.',
};
