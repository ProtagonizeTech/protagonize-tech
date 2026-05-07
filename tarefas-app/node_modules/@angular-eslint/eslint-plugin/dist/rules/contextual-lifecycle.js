"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'contextual-lifecycle';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Ensures that lifecycle methods are used in a correct context',
            recommended: 'recommended',
        },
        schema: [],
        messages: {
            contextualLifecycle: `Angular will not invoke the \`{{methodName}}\` lifecycle method within \`@{{classDecoratorName}}()\` classes`,
        },
    },
    defaultOptions: [],
    create(context) {
        function checkContext({ parent }, decorator) {
            const classDeclaration = parent;
            const allowedMethods = utils_1.ASTUtils.ANGULAR_CLASS_DECORATOR_LIFECYCLE_METHOD_MAPPER.get(decorator);
            const declaredMethods = utils_1.ASTUtils.getDeclaredMethods(classDeclaration);
            for (const method of declaredMethods) {
                const methodName = utils_1.ASTUtils.getMethodName(method);
                if (!methodName ||
                    !utils_1.ASTUtils.isAngularLifecycleMethod(methodName) ||
                    allowedMethods?.has(methodName)) {
                    continue;
                }
                context.report({
                    node: method.key,
                    messageId: 'contextualLifecycle',
                    data: { classDecoratorName: decorator, methodName },
                });
            }
        }
        return {
            [utils_1.Selectors.COMPONENT_CLASS_DECORATOR](node) {
                checkContext(node, utils_1.ASTUtils.AngularClassDecorators.Component);
            },
            [utils_1.Selectors.DIRECTIVE_CLASS_DECORATOR](node) {
                checkContext(node, utils_1.ASTUtils.AngularClassDecorators.Directive);
            },
            [utils_1.Selectors.INJECTABLE_CLASS_DECORATOR](node) {
                checkContext(node, utils_1.ASTUtils.AngularClassDecorators.Injectable);
            },
            [utils_1.Selectors.MODULE_CLASS_DECORATOR](node) {
                checkContext(node, utils_1.ASTUtils.AngularClassDecorators.NgModule);
            },
            [utils_1.Selectors.PIPE_CLASS_DECORATOR](node) {
                checkContext(node, utils_1.ASTUtils.AngularClassDecorators.Pipe);
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: `Angular lifecycle hooks are only invoked for specific class types. For example, ngOnInit(), ngOnChanges(), and ngOnDestroy() are only called for components and directives, not for services (@Injectable), pipes (@Pipe), or modules (@NgModule). Defining these lifecycle methods in the wrong class type gives a false impression that they will be called, leading to bugs where initialization or cleanup logic never executes. This rule ensures lifecycle methods are only used where Angular will actually invoke them.`,
};
