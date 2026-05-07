"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'component-class-suffix';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Classes decorated with @Component must have suffix "Component" (or custom) in their name. Note: As of v20, this is no longer recommended by the Angular Team.`,
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
            componentClassSuffix: `Component class names should end with one of these suffixes: {{suffixes}}`,
        },
    },
    defaultOptions: [
        {
            suffixes: ['Component'],
        },
    ],
    create(context, [{ suffixes }]) {
        return {
            [utils_1.Selectors.COMPONENT_CLASS_DECORATOR](node) {
                const classParent = node.parent;
                const className = utils_1.ASTUtils.getClassName(classParent);
                if (!className ||
                    !suffixes.some((suffix) => className.endsWith(suffix))) {
                    context.report({
                        node: classParent.id ? classParent.id : classParent,
                        messageId: 'componentClassSuffix',
                        data: { suffixes: (0, utils_1.toHumanReadableText)(suffixes) },
                    });
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Historically, appending 'Component' to component class names was recommended to make component files easily identifiable. However, as of Angular v20, the Angular Team no longer recommends this convention, favoring simpler class names. This rule remains available for teams that have established this naming pattern and wish to maintain consistency in their existing codebase.",
};
