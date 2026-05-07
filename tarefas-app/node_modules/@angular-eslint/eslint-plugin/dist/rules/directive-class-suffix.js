"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'directive-class-suffix';
const DEFAULT_SUFFIXES = ['Directive'];
const VALIDATOR_SUFFIX = 'Validator';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Classes decorated with @Directive must have suffix "Directive" (or custom) in their name. Note: As of v20, this is no longer recommended by the Angular Team.`,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    suffixes: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            directiveClassSuffix: `Directive class names should end with one of these suffixes: {{suffixes}}`,
        },
    },
    defaultOptions: [{ suffixes: DEFAULT_SUFFIXES }],
    create(context, [{ suffixes }]) {
        return {
            [utils_1.Selectors.DIRECTIVE_CLASS_DECORATOR](node) {
                const selectorPropertyValue = utils_1.ASTUtils.getDecoratorPropertyValue(node, 'selector');
                if (!selectorPropertyValue)
                    return;
                const classParent = node.parent;
                const className = utils_1.ASTUtils.getClassName(classParent);
                const declaredInterfaceNames = utils_1.ASTUtils.getDeclaredInterfaceNames(classParent);
                const hasValidatorInterface = declaredInterfaceNames.some((interfaceName) => interfaceName.endsWith(VALIDATOR_SUFFIX));
                const allSuffixes = suffixes.concat(hasValidatorInterface ? VALIDATOR_SUFFIX : []);
                if (!className ||
                    !allSuffixes.some((suffix) => className.endsWith(suffix))) {
                    context.report({
                        node: classParent.id ?? classParent,
                        messageId: 'directiveClassSuffix',
                        data: { suffixes: (0, utils_1.toHumanReadableText)(allSuffixes) },
                    });
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Historically, appending 'Directive' to directive class names was recommended to distinguish directives from other classes. However, as of Angular v20, the Angular Team no longer recommends this convention, favoring simpler class names. This rule remains available for teams that have established this naming pattern and wish to maintain consistency in their existing codebase.",
};
