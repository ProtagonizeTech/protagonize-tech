"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-attribute-decorator';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: `The @Attribute decorator is used to obtain a single value for an attribute. This is a much less common use case than getting a stream of values (using @Input), so the @Attribute decorator is often mistakenly used when @Input is intended. This rule disallows the usage of @Attribute decorator entirely to prevent these mistakes.`,
        },
        schema: [],
        messages: {
            noAttributeDecorator: '@Attribute can only obtain a single value and is rarely what is required. Use @Input instead to retrieve a stream of values.',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            'ClassDeclaration MethodDefinition[key.name="constructor"] Decorator[expression.callee.name="Attribute"]'(node) {
                context.report({
                    node,
                    messageId: 'noAttributeDecorator',
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'The @Attribute decorator is frequently misunderstood and misused. Unlike @Input(), which creates a binding that updates when the input value changes, @Attribute reads the attribute value only once during component construction and never updates. This single-read behavior is rarely what developers intend when they want to receive data from a parent component. In almost all cases, @Input() is the correct choice because it provides reactive updates. The @Attribute decorator is only appropriate for very specific optimization scenarios where you know the value will never change and want to avoid the overhead of change detection for that property. To prevent bugs from this common mistake, this rule disallows @Attribute entirely and encourages using @Input() instead, or modern signal-based inputs via input().',
};
