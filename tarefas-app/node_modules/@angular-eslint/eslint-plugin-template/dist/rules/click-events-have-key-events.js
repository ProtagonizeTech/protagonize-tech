"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const is_hidden_from_screen_reader_1 = require("../utils/is-hidden-from-screen-reader");
const is_interactive_element_1 = require("../utils/is-interactive-element");
const is_presentation_role_1 = require("../utils/is-presentation-role");
const get_attribute_value_1 = require("../utils/get-attribute-value");
exports.RULE_NAME = 'click-events-have-key-events';
const DEFAULT_OPTIONS = {
    ignoreWithDirectives: [],
};
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures that the click event is accompanied with at least one key event keyup, keydown or keypress.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreWithDirectives: {
                        type: 'array',
                        items: { type: 'string' },
                        uniqueItems: true,
                        default: DEFAULT_OPTIONS.ignoreWithDirectives,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            clickEventsHaveKeyEvents: 'click must be accompanied by either keyup, keydown or keypress event for accessibility.',
        },
    },
    defaultOptions: [DEFAULT_OPTIONS],
    create(context, [{ ignoreWithDirectives }]) {
        return {
            Element(node) {
                if (!(0, get_dom_elements_1.getDomElements)().has(node.name.toLowerCase())) {
                    return;
                }
                if (isIgnored(ignoreWithDirectives, node) ||
                    (0, is_presentation_role_1.isPresentationRole)(node) ||
                    (0, is_hidden_from_screen_reader_1.isHiddenFromScreenReader)(node) ||
                    (0, is_interactive_element_1.isInherentlyInteractiveElement)(node)) {
                    return;
                }
                // The final case that should be ignored is element which is not inherently interactive, but which has an interactive role.
                // TODO: extend utils with this check (and make it include all interactive roles)
                const role = (0, get_attribute_value_1.getAttributeValue)(node, 'role');
                if (role === 'button') {
                    return;
                }
                let hasClick = false, hasKeyEvent = false;
                for (const output of node.outputs) {
                    hasClick = hasClick || output.name === 'click';
                    hasKeyEvent =
                        hasKeyEvent ||
                            output.name.startsWith('keyup') ||
                            output.name.startsWith('keydown') ||
                            output.name.startsWith('keypress');
                }
                if (!hasClick || hasKeyEvent) {
                    return;
                }
                const parserServices = (0, utils_1.getTemplateParserServices)(context);
                const loc = parserServices.convertNodeSourceSpanToLoc(node.sourceSpan);
                context.report({
                    loc,
                    messageId: 'clickEventsHaveKeyEvents',
                });
            },
        };
    },
});
function isIgnored(ignoreWithDirectives, { inputs, attributes }) {
    if (ignoreWithDirectives && ignoreWithDirectives.length > 0) {
        for (const input of inputs) {
            if (ignoreWithDirectives.includes(input.name)) {
                return true;
            }
        }
        for (const attribute of attributes) {
            if (ignoreWithDirectives.includes(attribute.name)) {
                return true;
            }
        }
    }
    return false;
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Elements with click handlers must also be operable via keyboard for users who cannot use a mouse. This includes users with motor disabilities, users of assistive technologies, and keyboard-only users. While native interactive elements like buttons and links are keyboard-accessible by default (activated by Enter or Space keys), non-interactive elements with click handlers (like divs or spans) are not. For such elements, you must add keyboard event handlers (keyup, keydown, or keypress) that perform the same action as the click handler. Alternatively, use a semantic button element which handles this automatically. This is a WCAG Level A requirement for keyboard accessibility.',
};
