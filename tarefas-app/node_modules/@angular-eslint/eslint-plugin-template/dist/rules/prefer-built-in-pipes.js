"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_nearest_node_from_1 = require("../utils/get-nearest-node-from");
const is_bound_event_1 = require("../utils/is-bound-event");
const is_ast_with_name_1 = require("../utils/is-ast-with-name");
const DEFAULT_DISALLOW_LIST = [
    'toLowerCase',
    'toUpperCase',
    'toLocaleLowerCase',
    'toLocaleUpperCase',
];
exports.RULE_NAME = 'prefer-built-in-pipes';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Encourages the use of Angular built-in pipes (e.g. lowercase, uppercase, titlecase) instead of certain JavaScript methods in Angular templates.',
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    disallowList: {
                        items: { type: 'string' },
                        type: 'array',
                        uniqueItems: true,
                        description: 'Additional method names to disallow (defaults include common case/title casing helpers)',
                    },
                    allowInOutputHandlers: {
                        type: 'boolean',
                        description: 'Whether to allow these method calls inside output event handlers',
                    },
                },
                type: 'object',
            },
        ],
        messages: {
            preferBuiltInPipes: 'Avoid using method "{{ methodName }}" in templates. Prefer the Angular built-in pipes instead (e.g. lowercase, uppercase, titlecase).',
        },
    },
    defaultOptions: [
        {
            disallowList: [...DEFAULT_DISALLOW_LIST],
            allowInOutputHandlers: true,
        },
    ],
    create(context, [{ disallowList, allowInOutputHandlers }]) {
        (0, utils_1.ensureTemplateParser)(context);
        const sourceCode = context.sourceCode;
        const methodsToDisallow = disallowList || [...DEFAULT_DISALLOW_LIST];
        return {
            Call(node) {
                if (!isDisallowedMethod(node.receiver, methodsToDisallow)) {
                    return;
                }
                if (allowInOutputHandlers) {
                    const isChildOfBoundEvent = Boolean((0, get_nearest_node_from_1.getNearestNodeFrom)(node, is_bound_event_1.isBoundEvent));
                    if (isChildOfBoundEvent) {
                        return;
                    }
                }
                const methodName = getMethodName(node.receiver);
                const { sourceSpan: { start, end }, } = node.receiver;
                context.report({
                    loc: {
                        start: sourceCode.getLocFromIndex(start),
                        end: sourceCode.getLocFromIndex(end),
                    },
                    messageId: 'preferBuiltInPipes',
                    data: {
                        methodName,
                    },
                });
            },
        };
    },
});
function isDisallowedMethod(ast, disallowList) {
    return ((0, is_ast_with_name_1.isASTWithName)(ast) &&
        ast instanceof bundled_angular_compiler_1.PropertyRead &&
        disallowList.includes(ast.name));
}
function getMethodName(ast) {
    return (0, is_ast_with_name_1.isASTWithName)(ast) ? ast.name : 'unknown';
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Angular provides built-in pipes for common string transformations (lowercase, uppercase, titlecase) that are more efficient than calling JavaScript methods directly in templates. Pipes are pure by default, meaning Angular only recalculates them when inputs change, whereas method calls in templates run on every change detection cycle. For example, {{ name.toLowerCase() }} runs toLowerCase() repeatedly during change detection, while {{ name | lowercase }} only transforms the string when name changes. Using pipes also makes templates more declarative and idiomatic. The rule can be configured to allow method calls in event handlers like (click) where purity is not a concern. By default, the rule flags toLowerCase, toUpperCase, toLocaleLowerCase, and toLocaleUpperCase, but can be extended to other methods.',
};
