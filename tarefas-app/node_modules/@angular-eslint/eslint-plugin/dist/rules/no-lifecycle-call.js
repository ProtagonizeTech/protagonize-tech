"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-lifecycle-call';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows explicit calls to lifecycle methods',
        },
        schema: [],
        messages: {
            noLifecycleCall: 'Avoid explicit calls to lifecycle methods',
        },
    },
    defaultOptions: [],
    create(context) {
        const angularLifeCycleMethodsPattern = (0, utils_1.toPattern)([
            ...utils_1.ASTUtils.ANGULAR_LIFECYCLE_METHODS,
        ]);
        return {
            [`ClassDeclaration CallExpression > MemberExpression[property.name=${angularLifeCycleMethodsPattern}]`]: (node) => {
                const classDeclaration = utils_1.ASTUtils.getNearestNodeFrom(node, utils_1.ASTUtils.isClassDeclaration);
                if (!classDeclaration ||
                    !utils_1.ASTUtils.getAngularClassDecorator(classDeclaration) ||
                    (utils_1.ASTUtils.isSuper(node.object) && isSuperCallAllowed(node))) {
                    return;
                }
                context.report({ node: node.parent, messageId: 'noLifecycleCall' });
            },
        };
    },
});
function hasSameName({ property }, { key }) {
    return (utils_2.ASTUtils.isIdentifier(property) &&
        utils_2.ASTUtils.isIdentifier(key) &&
        property.name === key.name);
}
function isSuperCallAllowed(node) {
    const methodDefinition = utils_1.ASTUtils.getNearestNodeFrom(node, utils_1.ASTUtils.isMethodDefinition);
    return Boolean(methodDefinition && hasSameName(node, methodDefinition));
}
exports.RULE_DOCS_EXTENSION = {
    rationale: `Lifecycle hooks like ngOnInit(), ngOnDestroy(), and ngOnChanges() are designed to be called automatically by Angular at the appropriate times in a component's lifecycle. Calling them manually (e.g., 'this.ngOnInit()') breaks Angular's lifecycle management, can cause hooks to run multiple times or in the wrong order, and makes the code's execution flow harder to understand. The only exception is calling super.ngOnInit() in a derived class to ensure the parent class's initialization runs. If you need to share initialization logic, extract it into a separate method that both ngOnInit() and your other code can call.`,
};
