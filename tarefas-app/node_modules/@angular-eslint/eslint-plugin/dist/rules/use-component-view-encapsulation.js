"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'use-component-view-encapsulation';
const VIEW_ENCAPSULATION_NONE = 'ViewEncapsulation.None';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Disallows using \`${VIEW_ENCAPSULATION_NONE}\``,
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            useComponentViewEncapsulation: `Using \`${VIEW_ENCAPSULATION_NONE}\` makes your styles global, which may have an unintended effect`,
            suggestRemoveViewEncapsulationNone: `Remove \`${VIEW_ENCAPSULATION_NONE}\``,
        },
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.sourceCode;
        return {
            [`${utils_1.Selectors.COMPONENT_CLASS_DECORATOR} ${utils_1.Selectors.metadataProperty('encapsulation')} > MemberExpression[object.name='ViewEncapsulation'] > Identifier[name='None']`](node) {
                context.report({
                    node,
                    messageId: 'useComponentViewEncapsulation',
                    suggest: [
                        {
                            messageId: 'suggestRemoveViewEncapsulationNone',
                            fix: (fixer) => {
                                const importDeclarations = utils_1.ASTUtils.getImportDeclarations(node, '@angular/core') ?? [];
                                return [
                                    utils_1.RuleFixes.getNodeToCommaRemoveFix(sourceCode, node.parent.parent, fixer),
                                    utils_1.RuleFixes.getImportRemoveFix(sourceCode, importDeclarations, 'ViewEncapsulation', fixer),
                                ].filter(utils_1.isNotNullOrUndefined);
                            },
                        },
                    ],
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Setting encapsulation to ViewEncapsulation.None disables Angular's view encapsulation, making the component's styles global and affecting the entire application. This breaks component isolation and can cause unexpected styling conflicts throughout your app. When multiple components use ViewEncapsulation.None, their styles can interfere with each other in unpredictable ways, making it extremely difficult to reason about styling. A style intended for one component might accidentally affect completely unrelated components. This defeats one of Angular's key benefits: component style isolation. ViewEncapsulation.None is occasionally necessary for specific edge cases (like styling dynamically inserted content), but it should be avoided in normal component development. Use the default Emulated encapsulation, or ShadowDom for native Shadow DOM, to keep component styles properly isolated.",
};
