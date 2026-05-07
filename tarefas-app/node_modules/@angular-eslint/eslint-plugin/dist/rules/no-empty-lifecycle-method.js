"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-empty-lifecycle-method';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows declaring empty lifecycle methods',
            recommended: 'recommended',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            noEmptyLifecycleMethod: 'Lifecycle methods should not be empty',
            suggestRemoveLifecycleMethod: 'Remove lifecycle method',
        },
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.sourceCode;
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
            [`${utils_1.Selectors.decoratorDefinition(angularDecoratorsPattern)} > ClassBody > ${utils_1.Selectors.methodDefinition(angularLifecycleMethodsPattern)}[value.body.body.length=0]`](node) {
                context.report({
                    node,
                    messageId: 'noEmptyLifecycleMethod',
                    suggest: [
                        {
                            messageId: 'suggestRemoveLifecycleMethod',
                            fix: (fixer) => {
                                const importDeclarations = utils_1.ASTUtils.getImportDeclarations(node, '@angular/core') ?? [];
                                const interfaceName = utils_1.ASTUtils.getRawText(node).replace(/^ng+/, '');
                                const text = sourceCode.getText();
                                const totalInterfaceOccurrences = getTotalInterfaceOccurrences(text, interfaceName);
                                const totalInterfaceOccurrencesSafeForRemoval = 2;
                                return [
                                    fixer.remove(node),
                                    utils_1.RuleFixes.getImplementsRemoveFix(sourceCode, node.parent.parent, interfaceName, fixer),
                                    totalInterfaceOccurrences <=
                                        totalInterfaceOccurrencesSafeForRemoval
                                        ? utils_1.RuleFixes.getImportRemoveFix(sourceCode, importDeclarations, interfaceName, fixer)
                                        : null,
                                ].filter(utils_1.isNotNullOrUndefined);
                            },
                        },
                    ],
                });
            },
        };
    },
});
function stripSpecialCharacters(text) {
    return text.replace(/[\W]/g, '');
}
function getTotalInterfaceOccurrences(text, interfaceName) {
    return text
        .split(' ')
        .filter((item) => stripSpecialCharacters(item) === interfaceName).length;
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Empty lifecycle methods add noise to the codebase without providing any value. When a developer sees ngOnInit(), ngOnDestroy(), or other lifecycle hooks, they expect to find important initialization, cleanup, or other lifecycle-related logic. Finding an empty method wastes time during code review and maintenance. Empty lifecycle methods often remain after code has been refactored or removed, serving as dead code that clutters the component. They also require unnecessary imports of lifecycle interfaces (like OnInit, OnDestroy). Removing empty lifecycle methods makes components cleaner, easier to understand, and reduces the file size.',
};
