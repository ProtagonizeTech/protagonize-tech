"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'use-lifecycle-interface';
const STYLE_GUIDE_LINK = 'https://angular.dev/style-guide#use-lifecycle-hook-interfaces';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Ensures that classes implement lifecycle interfaces corresponding to the declared lifecycle methods. See more at ${STYLE_GUIDE_LINK}`,
        },
        schema: [],
        messages: {
            useLifecycleInterface: `Lifecycle interface '{{interfaceName}}' should be implemented for method '{{methodName}}'. (${STYLE_GUIDE_LINK})`,
        },
        fixable: 'code',
    },
    defaultOptions: [],
    create(context) {
        const angularLifecycleMethodsPattern = (0, utils_1.toPattern)([
            ...utils_1.ASTUtils.ANGULAR_LIFECYCLE_METHODS,
        ]);
        return {
            [`MethodDefinition[key.name=${angularLifecycleMethodsPattern}]`](node) {
                const { key, parent: { parent }, } = node;
                if (!utils_1.ASTUtils.getAngularClassDecorator(parent))
                    return;
                // Do not report the method if it has the override keyword because it implies the base class is responsible for the implementation
                if (node.override) {
                    return;
                }
                const declaredLifecycleInterfaces = utils_1.ASTUtils.getDeclaredAngularLifecycleInterfaces(parent);
                const methodName = key
                    .name;
                const interfaceName = utils_1.ASTUtils.getLifecycleInterfaceByMethodName(methodName);
                const isMethodImplemented = declaredLifecycleInterfaces.includes(utils_1.ASTUtils.AngularLifecycleInterfaces[interfaceName]);
                if (isMethodImplemented)
                    return;
                context.report({
                    node: key,
                    messageId: 'useLifecycleInterface',
                    data: { interfaceName, methodName },
                    fix: (fixer) => {
                        const { implementsNodeReplace, implementsTextReplace } = utils_1.RuleFixes.getImplementsSchemaFixer(parent, interfaceName);
                        return [
                            utils_1.RuleFixes.getImportAddFix({
                                fixer,
                                importName: interfaceName,
                                moduleName: '@angular/core',
                                node: parent,
                            }),
                            fixer.insertTextAfter(implementsNodeReplace, implementsTextReplace),
                        ].filter(utils_1.isNotNullOrUndefined);
                    },
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: `Implementing lifecycle interfaces (like OnInit, OnDestroy, AfterViewInit) provides TypeScript compile-time checking to ensure you've spelled the lifecycle method names correctly and used the right method signatures. For example, if you typo 'ngOnInit' as 'ngOninit', TypeScript will catch this error if your class implements OnInit. The interfaces also serve as self-documentation, making it immediately clear which lifecycle hooks a component uses. While Angular will still call correctly-named lifecycle methods even without the interface, using the interface leverages TypeScript's type safety to catch errors earlier in development.`,
};
