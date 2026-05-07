"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'prefer-standalone';
const RECOMMENDED_GUIDE_URL = 'https://angular.dev/reference/migrations/standalone';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Ensures Components, Directives and Pipes do not opt out of standalone.`,
            recommended: 'recommended',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            preferStandalone: `Components, Directives and Pipes should not opt out of standalone. Following this guide is highly recommended: ${RECOMMENDED_GUIDE_URL}`,
            removeStandaloneFalse: `Quickly remove 'standalone: false'. NOTE - Following this guide is highly recommended: ${RECOMMENDED_GUIDE_URL}`,
        },
    },
    defaultOptions: [],
    create(context) {
        const standaloneRuleFactory = (type) => (node) => {
            const standalone = utils_1.ASTUtils.getDecoratorPropertyValue(node, 'standalone');
            // Leave the standalone property alone if it was set to true or not present
            if (!standalone ||
                (utils_1.ASTUtils.isLiteral(standalone) && standalone.value === true)) {
                return;
            }
            if (!utils_1.ASTUtils.getDecoratorArgument(node)) {
                return;
            }
            context.report({
                node: standalone.parent,
                messageId: 'preferStandalone',
                data: { type },
                suggest: [
                    {
                        messageId: 'removeStandaloneFalse',
                        fix: (fixer) => {
                            // Remove the standalone property altogether if it was set to false
                            const tokenAfter = context.sourceCode.getTokenAfter(standalone.parent);
                            // Remove the trailing comma, if present
                            const removeStart = standalone.parent.range[0];
                            let removeEnd = standalone.parent.range[1];
                            if (tokenAfter && tokenAfter.value === ',') {
                                removeEnd = tokenAfter.range[1];
                            }
                            return fixer.removeRange([removeStart, removeEnd]);
                        },
                    },
                ],
            });
        };
        return {
            [utils_1.Selectors.COMPONENT_CLASS_DECORATOR]: standaloneRuleFactory('component'),
            [utils_1.Selectors.DIRECTIVE_CLASS_DECORATOR]: standaloneRuleFactory('directive'),
            [utils_1.Selectors.PIPE_CLASS_DECORATOR]: standaloneRuleFactory('pipe'),
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Standalone components, directives, and pipes are the recommended way to build Angular applications. Setting standalone: false opts out of the standalone API, tying your code to the older NgModule-based architecture. Standalone components simplify Angular applications by eliminating the need for NgModules in most cases, reducing boilerplate and making dependencies more explicit. Each standalone component declares its own dependencies directly, making it self-contained and easier to understand, test, and reuse. Standalone components also enable better tree-shaking and lazy loading. Angular provides comprehensive migration guides to help transition existing applications, such as https://angular.dev/reference/migrations/standalone. New projects should use standalone components from the start, and existing projects should avoid adding new non-standalone components as they will make future migrations harder.',
};
