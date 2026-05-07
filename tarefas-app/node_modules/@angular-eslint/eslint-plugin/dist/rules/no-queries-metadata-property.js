"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-queries-metadata-property';
const METADATA_PROPERTY_NAME = 'queries';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Disallows usage of the \`${METADATA_PROPERTY_NAME}\` metadata property.`,
        },
        schema: [],
        messages: {
            noQueriesMetadataProperty: `Use @${utils_1.ASTUtils.AngularInnerClassDecorators.Output} rather than the \`${METADATA_PROPERTY_NAME}\` metadata property`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [utils_1.Selectors.COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR](node) {
                const propertyExpression = utils_1.ASTUtils.getDecoratorPropertyValue(node, METADATA_PROPERTY_NAME);
                if (!propertyExpression) {
                    return;
                }
                context.report({
                    node: propertyExpression.parent,
                    messageId: 'noQueriesMetadataProperty',
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Using the 'queries' metadata property (@Component({ queries: { child: new ViewChild('ref') } })) is discouraged in favor of decorator syntax (@ViewChild('ref')) because: (1) decorators make it immediately clear which properties are view/content queries when reading the class, (2) decorators allow configuration right next to the property declaration, (3) decorator syntax works better with IDE features and TypeScript type checking, and (4) the decorator approach is the standard modern Angular pattern. The metadata property approach is a legacy pattern that makes code harder to read and maintain.",
};
