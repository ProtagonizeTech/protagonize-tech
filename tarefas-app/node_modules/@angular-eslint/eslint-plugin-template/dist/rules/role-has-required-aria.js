"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const aria_query_1 = require("aria-query");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const to_pattern_1 = require("../utils/to-pattern");
const is_semantic_role_element_1 = require("../utils/is-semantic-role-element");
exports.RULE_NAME = 'role-has-required-aria';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures elements with ARIA roles have all required properties for that role.',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            roleHasRequiredAria: 'The {{element}} with role="{{role}}" does not have required ARIA properties: {{missingProps}}',
            suggestRemoveRole: 'Remove role `{{role}}`',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const domElements = [...(0, get_dom_elements_1.getDomElements)()];
        const uppercaseDomElements = domElements.map((element) => element.toUpperCase());
        const elementNamePattern = (0, to_pattern_1.toPattern)([
            ...domElements,
            ...uppercaseDomElements,
        ]);
        return {
            [`Element[name=${elementNamePattern}] > TextAttribute[name='role']`](node) {
                const { value: role, sourceSpan } = node;
                const { attributes, inputs, name: element } = node.parent;
                const props = [...attributes, ...inputs];
                const roleDef = aria_query_1.roles.get(role);
                const requiredProps = Object.keys(roleDef?.requiredProps || {});
                if (!requiredProps.length)
                    return;
                if ((0, is_semantic_role_element_1.isSemanticRoleElement)(element, role, props))
                    return;
                const missingProps = requiredProps
                    .filter((requiredProp) => !props.find((prop) => prop.name === requiredProp))
                    .join(', ');
                if (missingProps) {
                    const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                    context.report({
                        loc,
                        messageId: 'roleHasRequiredAria',
                        data: {
                            element,
                            role,
                            missingProps,
                        },
                        suggest: [
                            {
                                messageId: 'suggestRemoveRole',
                                data: {
                                    element,
                                    role,
                                    missingProps,
                                },
                                fix: (fixer) => fixer.removeRange([
                                    sourceSpan?.start.offset - 1,
                                    sourceSpan?.end.offset,
                                ]),
                            },
                        ],
                    });
                }
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'ARIA roles define what an element is and how it should behave for assistive technologies, but many roles require specific ARIA properties to be meaningful and functional. For example, a role="slider" must have aria-valuemin, aria-valuemax, and aria-valuenow to communicate its state to screen readers. Without these required properties, the role is incomplete and may confuse or mislead users of assistive technologies. The ARIA specification defines which properties are required for each role, and this rule enforces those requirements based on the official aria-query library. Ensuring required ARIA properties are present is critical for making interactive elements accessible. This is a WCAG Level A requirement for proper ARIA implementation.',
};
