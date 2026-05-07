"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'prefer-output-emitter-ref';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Use `OutputEmitterRef` instead of `@Output()`',
        },
        schema: [],
        messages: {
            preferOutputEmitterRef: 'Use `OutputEmitterRef` via `output()` for Component and Directive outputs rather than the legacy `@Output()` decorator',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [utils_1.Selectors.OUTPUT_DECORATOR]: (node) => {
                context.report({ node, messageId: 'preferOutputEmitterRef' });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "The output() function is Angular's modern API for component outputs, intended to be used instead of the @Output() decorator (which still exists for backwards compatibility). OutputEmitterRef (returned by output()) provides better type safety, integrates seamlessly with Angular's signal ecosystem, and offers a more functional programming approach. Unlike @Output() which uses EventEmitter, output() is specifically designed for component outputs and has a cleaner, more predictable API, that resembles other function based and signals APIs that have been added to the framework in recent versions.",
};
