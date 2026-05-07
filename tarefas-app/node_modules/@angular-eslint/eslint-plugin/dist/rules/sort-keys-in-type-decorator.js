"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const DEFAULT_ORDER = {
    // https://angular.dev/api/core/Component
    Component: [
        'selector',
        'imports',
        'standalone',
        'templateUrl',
        'template',
        'styleUrl',
        'styleUrls',
        'styles',
        'providers',
        'changeDetection',
        'encapsulation',
        'viewProviders',
        'host',
        'hostDirectives',
        'inputs',
        'outputs',
        'animations',
        'schemas',
        'exportAs',
        'queries',
        'preserveWhitespaces',
        'jit',
        // Deprecated properties according to https://angular.dev/api/core/Component
        'moduleId',
        'interpolation',
    ],
    // https://angular.dev/api/core/Directive
    Directive: [
        'selector',
        'standalone',
        'providers',
        'host',
        'hostDirectives',
        'inputs',
        'outputs',
        'exportAs',
        'queries',
        'jit',
    ],
    // https://angular.dev/api/core/NgModule
    NgModule: [
        'id', // rarely used but good to have first if set
        'imports',
        'declarations',
        'providers',
        'exports',
        'bootstrap',
        'schemas',
        'jit',
    ],
    // https://angular.dev/api/core/Pipe
    Pipe: ['name', 'standalone', 'pure'],
};
exports.RULE_NAME = 'sort-keys-in-type-decorator';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that keys in type decorators (Component, Directive, NgModule, Pipe) are sorted in a consistent order',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    Component: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    Directive: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    NgModule: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    Pipe: {
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
            incorrectOrder: 'Keys in @{{decorator}} decorator should be ordered: {{expectedOrder}}',
        },
    },
    defaultOptions: [DEFAULT_ORDER],
    create(context, [orderConfig]) {
        function checkContext(node, decoratorName) {
            const expectedOrder = orderConfig[decoratorName];
            if (!expectedOrder) {
                return;
            }
            const argument = utils_1.ASTUtils.getDecoratorArgument(node);
            if (!argument) {
                return;
            }
            const properties = utils_1.ASTUtils.getDecoratorProperties(node);
            if (properties.length <= 1) {
                return;
            }
            const firstConfiguredIndex = properties.findIndex(({ key }) => expectedOrder.includes(key.name));
            const lastNonConfiguredIndex = properties.findIndex(({ key }) => !expectedOrder.includes(key.name));
            if (firstConfiguredIndex !== -1 &&
                lastNonConfiguredIndex !== -1 &&
                lastNonConfiguredIndex < firstConfiguredIndex) {
                createInvalidSortRuleForDecorator(context, decoratorName, expectedOrder, properties, properties[lastNonConfiguredIndex]);
                return;
            }
            const configuredProperties = properties.filter(({ key }) => expectedOrder.includes(key.name));
            if (configuredProperties.length) {
                const actualConfiguredOrder = configuredProperties.map(({ key }) => key.name);
                const expectedConfiguredOrder = expectedOrder.filter((key) => actualConfiguredOrder.includes(key));
                if (actualConfiguredOrder.length &&
                    JSON.stringify(actualConfiguredOrder) !==
                        JSON.stringify(expectedConfiguredOrder)) {
                    const firstOutOfOrderIndex = actualConfiguredOrder.findIndex((key, index) => key !== expectedConfiguredOrder[index]);
                    const outOfOrderProperty = configuredProperties[firstOutOfOrderIndex];
                    createInvalidSortRuleForDecorator(context, decoratorName, expectedOrder, properties, outOfOrderProperty);
                }
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
function createInvalidSortRuleForDecorator(context, decoratorName, expectedOrder, properties, node) {
    const presentProps = properties.map((prop) => prop.key.name);
    const relevantExpectedOrder = expectedOrder.filter((propName) => presentProps.includes(propName));
    const data = {
        decorator: decoratorName,
        expectedOrder: relevantExpectedOrder.join(', '),
    };
    reportAndFix(context, node, 'incorrectOrder', data, properties, expectedOrder, node.parent);
}
function reportAndFix(context, node, messageId, data, properties, expectedOrder, objectExpression) {
    const sourceCode = context.sourceCode;
    context.report({
        node,
        messageId,
        data,
        fix(fixer) {
            const indentation = utils_1.CommentUtils.getObjectIndentation(sourceCode, objectExpression);
            const propNames = properties.map((p) => p.key.name);
            const configuredProps = expectedOrder.filter((name) => propNames.includes(name));
            const unconfiguredProps = propNames.filter((name) => !expectedOrder.includes(name));
            const filteredOrder = [...configuredProps, ...unconfiguredProps];
            const propInfoMap = utils_1.CommentUtils.extractPropertyComments(sourceCode, properties, objectExpression, indentation);
            const sortedText = utils_1.CommentUtils.buildSortedPropertiesWithComments(filteredOrder, propInfoMap, indentation);
            return fixer.replaceText(objectExpression, `{\n${sortedText}\n${indentation.slice(0, -2)}}`);
        },
    });
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Maintaining a consistent order for properties in Angular decorators (@Component, @Directive, @NgModule, @Pipe) makes code more predictable and easier to scan. When all components in a codebase follow the same property order, developers can quickly locate specific metadata without searching. For example, if selector always comes first and providers always comes before changeDetection, you develop muscle memory for where to look. This is especially helpful in large components with many properties. The recommended default order groups related properties logically: identification (selector, name) first, then dependencies (imports, providers), then templates/styles, then configuration options. Consistent ordering also makes code reviews easier, reduces merge conflicts when multiple developers edit decorators, and creates a professional, well-organized codebase.',
};
