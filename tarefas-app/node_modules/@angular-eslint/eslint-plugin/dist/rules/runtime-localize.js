"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'runtime-localize';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that $localize tagged messages can use runtime-loaded translations.',
        },
        schema: [],
        messages: {
            runtimeLocalize: `$localize could be called before translations are loaded`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            TaggedTemplateExpression(taggedTemplateExpression) {
                if (utils_1.ASTUtils.isIdentifier(taggedTemplateExpression.tag) &&
                    taggedTemplateExpression.tag.name === '$localize') {
                    for (const ancestor of context.sourceCode.getAncestors(taggedTemplateExpression)) {
                        if (ancestor.type === utils_1.AST_NODE_TYPES.FunctionDeclaration ||
                            ancestor.type === utils_1.AST_NODE_TYPES.FunctionExpression ||
                            ancestor.type === utils_1.AST_NODE_TYPES.ArrowFunctionExpression ||
                            (ancestor.type === utils_1.AST_NODE_TYPES.PropertyDefinition &&
                                !ancestor.static)) {
                            return;
                        }
                    }
                    context.report({
                        loc: taggedTemplateExpression.tag.loc,
                        messageId: 'runtimeLocalize',
                    });
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Using $localize at the top level of a module (outside of functions or methods) means the localization happens immediately when the module loads, before runtime translation data can be loaded. This creates a timing problem - the string gets localized using whatever translations are available at module load time (typically none), and the translated value is frozen. Even if you load translations later, these top-level $localize calls won't use them. Instead, $localize should be called inside functions, methods, or non-static class properties so it executes after translations are loaded. This ensures the runtime-loaded translations are actually used. For top-level strings that need localization, initialize them in a function called after translations load, or use them within component templates where Angular handles the timing correctly.",
};
