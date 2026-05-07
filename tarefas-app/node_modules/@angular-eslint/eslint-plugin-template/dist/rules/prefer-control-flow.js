"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'prefer-control-flow';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that the built-in control flow is used.',
            recommended: 'recommended',
        },
        schema: [],
        messages: {
            preferControlFlow: 'Use built-in control flow instead of directive {{name}}.',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        return {
            'BoundAttribute[name=/^(ngForOf|ngIf|ngSwitch)$/]'({ sourceSpan, name, }) {
                const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                context.report({
                    messageId: 'preferControlFlow',
                    loc,
                    data: { name },
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Angular v17 introduced built-in control flow (@if, @for, @switch) as a replacement for the structural directives (*ngIf, *ngFor, *ngSwitch). The new syntax is more readable, performant, and type-safe. Built-in control flow has better syntax highlighting in editors, clearer nesting behavior, built-in features like @empty for loops and @else for conditionals, and improved tree-shaking. The new syntax also enables better compile-time optimizations and runtime performance. While the old structural directives remain supported for backward compatibility, new code should use the modern built-in control flow. Teams migrating to v17+ are encouraged to adopt this syntax for consistency and to benefit from ongoing performance improvements.',
};
