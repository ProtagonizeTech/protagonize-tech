"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const is_hidden_from_screen_reader_1 = require("../utils/is-hidden-from-screen-reader");
exports.RULE_NAME = 'elements-content';
const DEFAULT_SAFELIST_ATTRIBUTES = [
    'aria-label',
    'innerHtml',
    'innerHTML',
    'innerText',
    'outerHTML',
    'textContent',
    'title',
];
const DEFAULT_OPTIONS = {
    allowList: DEFAULT_SAFELIST_ATTRIBUTES,
};
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures that the heading, anchor and button elements have content in them',
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
            elementsContent: '<{{element}}> should have content',
        },
    },
    defaultOptions: [DEFAULT_OPTIONS],
    create(context, [{ allowList }]) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        return {
            'Element[name=/^(a|button|h1|h2|h3|h4|h5|h6)$/i][children.length=0]'(node) {
                if ((0, is_hidden_from_screen_reader_1.isHiddenFromScreenReader)(node))
                    return;
                const { attributes, inputs, name: element, sourceSpan } = node;
                const safelistAttributes = new Set([
                    ...DEFAULT_SAFELIST_ATTRIBUTES,
                    ...(allowList ?? []),
                ]);
                const hasAttributeSafelisted = [...attributes, ...inputs]
                    .map(({ name }) => name)
                    .some((inputName) => safelistAttributes.has(inputName));
                if (hasAttributeSafelisted)
                    return;
                const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                context.report({
                    loc,
                    messageId: 'elementsContent',
                    data: { element },
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Interactive elements like buttons, anchors (links), and headings must have accessible text content for screen readers. For example, '<button><mat-icon>delete</mat-icon></button>' is not accessible because screen readers will just announce 'button' without explaining what it does. Solutions include adding visible text, using aria-label, or including visually-hidden text with CSS. This ensures all users, including those using screen readers, know the purpose of each interactive element. This is a fundamental WCAG requirement for web accessibility.",
};
