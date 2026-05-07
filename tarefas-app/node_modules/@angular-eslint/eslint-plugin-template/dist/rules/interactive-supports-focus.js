"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const is_hidden_from_screen_reader_1 = require("../utils/is-hidden-from-screen-reader");
const is_interactive_element_1 = require("../utils/is-interactive-element");
const is_content_editable_1 = require("../utils/is-content-editable");
const is_disabled_element_1 = require("../utils/is-disabled-element");
const is_presentation_role_1 = require("../utils/is-presentation-role");
exports.RULE_NAME = 'interactive-supports-focus';
const DEFAULT_ALLOW_LIST = ['form'];
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures that elements with interactive handlers like `(click)` are focusable.',
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    allowList: {
                        items: { type: 'string' },
                        type: 'array',
                        uniqueItems: true,
                    },
                },
                type: 'object',
            },
        ],
        messages: {
            interactiveSupportsFocus: 'Elements with interaction handlers must be focusable.',
        },
    },
    defaultOptions: [{ allowList: DEFAULT_ALLOW_LIST }],
    create(context, [{ allowList }]) {
        return {
            Element(node) {
                const elementType = node.name.toLowerCase();
                if (!(0, get_dom_elements_1.getDomElements)().has(elementType)) {
                    return;
                }
                const interactiveOutput = node.outputs.find((output) => output.name === 'click' ||
                    output.name.startsWith('keyup') ||
                    output.name.startsWith('keydown') ||
                    output.name.startsWith('keypress'));
                if (isElementInAllowList(elementType, allowList))
                    return;
                if (!interactiveOutput ||
                    (0, is_disabled_element_1.isDisabledElement)(node) ||
                    (0, is_hidden_from_screen_reader_1.isHiddenFromScreenReader)(node) ||
                    (0, is_presentation_role_1.isPresentationRole)(node)) {
                    // Presentation is an intentional signal from the author
                    // that this element is not meant to be perceivable.
                    // For example, a click screen overlay to close a dialog.
                    return;
                }
                const tabIndex = [...node.attributes, ...node.inputs].find((attr) => attr.name === 'tabindex');
                if (interactiveOutput &&
                    !tabIndex &&
                    !(0, is_interactive_element_1.isInherentlyInteractiveElement)(node) &&
                    !(0, is_interactive_element_1.isNonInteractiveRole)(node) &&
                    !(0, is_content_editable_1.isContentEditable)(node)) {
                    const parserServices = (0, utils_1.getTemplateParserServices)(context);
                    const loc = parserServices.convertNodeSourceSpanToLoc(node.sourceSpan);
                    const messageId = 'interactiveSupportsFocus';
                    context.report({
                        loc,
                        messageId,
                    });
                }
            },
        };
    },
});
function isElementInAllowList(elementType, allowList) {
    return (allowList && allowList.length > 0 && allowList.indexOf(elementType) > -1);
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Interactive elements with click handlers or other event listeners must be keyboard-accessible to users who cannot use a mouse. Elements that trigger actions must be focusable (either naturally like buttons and links, or via tabindex) so keyboard users can navigate to them and activate them with Enter or Space. Without this, keyboard-only users, screen reader users, and users with motor disabilities cannot interact with the application. Native interactive elements (button, a, input, select, textarea) are automatically focusable and keyboard-accessible. For custom interactive elements, you must add tabindex="0" to make them focusable and add appropriate keyboard event handlers. This is a WCAG Level A requirement for keyboard accessibility.',
};
