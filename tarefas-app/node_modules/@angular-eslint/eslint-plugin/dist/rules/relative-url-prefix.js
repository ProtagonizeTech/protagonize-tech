"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'relative-url-prefix';
const RELATIVE_URL_PREFIX_MATCHER = /^\.\.?\/.+/;
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `The ./ and ../ prefix is standard syntax for relative URLs; don't depend on Angular's current ability to do without that prefix.`,
        },
        schema: [],
        messages: {
            relativeUrlPrefix: `The ./ and ../ prefix is standard syntax for relative URLs.`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [`${utils_1.Selectors.COMPONENT_CLASS_DECORATOR} Property[key.name='templateUrl']`]({ value, }) {
                if (!isUrlInvalid(value))
                    return;
                context.report({
                    node: value,
                    messageId: 'relativeUrlPrefix',
                });
            },
            [`${utils_1.Selectors.COMPONENT_CLASS_DECORATOR} Property[key.name='styleUrls']`]({ value, }) {
                if (!utils_1.ASTUtils.isArrayExpression(value))
                    return;
                value.elements.filter(isUrlInvalid).forEach((element) => {
                    if (!element) {
                        return;
                    }
                    context.report({
                        node: element,
                        messageId: 'relativeUrlPrefix',
                    });
                });
            },
        };
    },
});
function isUrlInvalid(node) {
    if (!node) {
        return false;
    }
    if (utils_1.ASTUtils.isTemplateLiteral(node)) {
        return !RELATIVE_URL_PREFIX_MATCHER.test(node.quasis[0].value.raw);
    }
    return (!utils_1.ASTUtils.isStringLiteral(node) ||
        !RELATIVE_URL_PREFIX_MATCHER.test(node.value));
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "Using relative URLs (like './user-profile.component.html') instead of absolute URLs (like 'app/users/user-profile.component.html') for templateUrl and styleUrls makes components more portable and easier to refactor. When you move a component to a different directory, relative URLs don't need to be updated as long as the template and styles move with the component. This follows the principle of co-locating related files and makes refactoring safer. Relative URLs should typically start with './' for files in the same directory or '../' for files in parent directories.",
};
