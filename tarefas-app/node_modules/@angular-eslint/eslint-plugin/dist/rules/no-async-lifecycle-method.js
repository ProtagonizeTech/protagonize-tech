"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-async-lifecycle-method';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: `Angular Lifecycle methods should not be async. Angular does not wait for async lifecycle but the code incorrectly suggests it does.`,
        },
        schema: [],
        messages: {
            noAsyncLifecycleMethod: 'Angular Lifecycle method should not be async',
        },
    },
    defaultOptions: [],
    create(context) {
        const angularDecoratorsPattern = (0, utils_1.toPattern)([
            'Component',
            'Directive',
            'Injectable',
            'NgModule',
            'Pipe',
        ]);
        const angularLifecycleMethodsPattern = (0, utils_1.toPattern)([
            ...utils_1.ASTUtils.ANGULAR_LIFECYCLE_METHODS,
        ]);
        return {
            [`${utils_1.Selectors.decoratorDefinition(angularDecoratorsPattern)} > ClassBody > MethodDefinition[key.name=${angularLifecycleMethodsPattern}]`](node) {
                if (node.value.async === true) {
                    context.report({
                        node: node.key,
                        messageId: 'noAsyncLifecycleMethod',
                    });
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Angular does not wait for async lifecycle methods to complete before continuing with the component lifecycle. If you make ngOnInit() async, Angular will call it and immediately move on without waiting for any await statements inside to resolve. This creates a misleading code pattern where it appears Angular will wait for asynchronous operations to complete, but it won't. For example, if ngOnInit() fetches data asynchronously, the component will continue rendering with potentially incomplete data. Instead of making lifecycle methods async, call async functions from within them and handle the promises appropriately, or use Angular patterns like resolvers, signals with async pipes, or reactive approaches with RxJS.",
};
