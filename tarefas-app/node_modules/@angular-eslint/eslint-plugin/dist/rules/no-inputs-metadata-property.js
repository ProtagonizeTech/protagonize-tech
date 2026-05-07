"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-inputs-metadata-property';
const METADATA_PROPERTY_NAME = 'inputs';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Disallows usage of the \`${METADATA_PROPERTY_NAME}\` metadata property`,
            recommended: 'recommended',
        },
        schema: [],
        messages: {
            noInputsMetadataProperty: `Use \`@Input\` rather than the \`${METADATA_PROPERTY_NAME}\` metadata property`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [`${utils_1.Selectors.COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR} ${utils_1.Selectors.metadataProperty(METADATA_PROPERTY_NAME)}`](node) {
                /**
                 * Angular v15 introduced the directive composition API: https://angular.dev/guide/directives/directive-composition-api
                 * Using host directive inputs using this API is not a bad practice and should not be reported
                 */
                const ancestorMayBeHostDirectiveAPI = node.parent?.parent?.parent;
                if (ancestorMayBeHostDirectiveAPI &&
                    utils_1.ASTUtils.isProperty(ancestorMayBeHostDirectiveAPI)) {
                    const hostDirectiveAPIPropertyName = 'hostDirectives';
                    if ((utils_1.ASTUtils.isLiteral(ancestorMayBeHostDirectiveAPI.key) &&
                        ancestorMayBeHostDirectiveAPI.key.value ===
                            hostDirectiveAPIPropertyName) ||
                        (utils_2.ASTUtils.isIdentifier(ancestorMayBeHostDirectiveAPI.key) &&
                            ancestorMayBeHostDirectiveAPI.key.name ===
                                hostDirectiveAPIPropertyName)) {
                        return;
                    }
                }
                context.report({
                    node,
                    messageId: 'noInputsMetadataProperty',
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Using the 'inputs' metadata property (@Component({ inputs: ['name'] })) is discouraged in favor of modern alternatives like the signal-based input() function (introduced in Angular v17.1) or the @Input() decorator. Modern approaches offer several benefits: (1) they make it immediately clear which properties are part of the component's API when reading the class, (2) configuration happens in one place right next to the property, (3) they work better with IDE features like Find References and Rename Refactoring, (4) input() provides signal-based reactivity with built-in features like required inputs, transforms, and aliases, and (5) @Input() decorator offers similar features for non-signal inputs. The metadata property approach is a legacy pattern that obscures the component's interface and requires looking in two places (decorator metadata and class body) to understand the component's API. For new code, prefer input() for signal-based reactivity or @Input() for traditional inputs.",
};
