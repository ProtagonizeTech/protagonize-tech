"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'use-injectable-provided-in';
const METADATA_PROPERTY_NAME = 'providedIn';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Using the \`${METADATA_PROPERTY_NAME}\` property makes \`Injectables\` tree-shakable`,
        },
        hasSuggestions: true,
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreClassNamePattern: {
                        type: 'string',
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            useInjectableProvidedIn: `The \`${METADATA_PROPERTY_NAME}\` property is mandatory for \`Injectables\``,
            suggestInjector: `Use \`${METADATA_PROPERTY_NAME}: '{{injector}}'\``,
        },
    },
    defaultOptions: [{}],
    create(context, [{ ignoreClassNamePattern }]) {
        const injectableClassDecorator = `ClassDeclaration:not([id.name=${ignoreClassNamePattern}]):not(:has(TSClassImplements:matches([expression.property.name='HttpInterceptor'], [expression.name='HttpInterceptor']))) > Decorator[expression.callee.name="Injectable"]`;
        const providedInMetadataProperty = utils_1.Selectors.metadataProperty(METADATA_PROPERTY_NAME);
        const withoutProvidedInDecorator = `${injectableClassDecorator}:matches([expression.arguments.length=0], [expression.arguments.0.type='ObjectExpression']:not(:has(${providedInMetadataProperty})))`;
        const nullableProvidedInProperty = `${injectableClassDecorator} ${providedInMetadataProperty}:matches([value.type='Identifier'][value.name='undefined'], [value.type='Literal'][value.raw='null'])`;
        const selectors = [
            withoutProvidedInDecorator,
            nullableProvidedInProperty,
        ].join(',');
        return {
            [selectors](node) {
                context.report({
                    node: utils_1.ASTUtils.isProperty(node) ? node.value : node,
                    messageId: 'useInjectableProvidedIn',
                    suggest: ['any', 'platform', 'root'].map((injector) => ({
                        messageId: 'suggestInjector',
                        fix: (fixer) => {
                            return utils_1.ASTUtils.isProperty(node)
                                ? fixer.replaceText(node.value, `'${injector}'`)
                                : (utils_1.RuleFixes.getDecoratorPropertyAddFix(node, fixer, `${METADATA_PROPERTY_NAME}: '${injector}'`) ?? []);
                        },
                        data: { injector },
                    })),
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: `Using 'providedIn' in the @Injectable() decorator (like '@Injectable({ providedIn: "root" })') enables tree-shaking, which means Angular can remove the service from your production bundle if it's never actually used. Without 'providedIn', services must be registered in a module's providers array, and Angular must include them in the bundle even if they're unused. This can significantly increase bundle size. Additionally, 'providedIn' makes services easier to use (no need to add them to module providers) and makes circular dependencies less likely. The 'providedIn' syntax is the modern, recommended way to provide services.`,
};
