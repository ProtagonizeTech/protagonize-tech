"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const to_pattern_1 = require("../utils/to-pattern");
exports.RULE_NAME = 'no-positive-tabindex';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that the `tabindex` attribute is not positive',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            noPositiveTabindex: 'The `tabindex` attribute should not be positive',
            suggestNonNegativeTabindex: 'Use `tabindex="{{tabindex}}"`',
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
            [`Element[name=${elementNamePattern}] > BoundAttribute[name="tabindex"][value.ast.value>0], TextAttribute[name="tabindex"][value>0]`]({ valueSpan, }) {
                const loc = parserServices.convertNodeSourceSpanToLoc(valueSpan);
                context.report({
                    loc,
                    messageId: 'noPositiveTabindex',
                    suggest: ['-1', '0'].map((tabindex) => ({
                        messageId: 'suggestNonNegativeTabindex',
                        fix: (fixer) => fixer.replaceTextRange([valueSpan.start.offset, valueSpan.end.offset], tabindex),
                        data: { tabindex },
                    })),
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Using positive tabindex values (like tabindex="1" or tabindex="5") disrupts the natural tab order and creates a confusing navigation experience. The natural tab order follows the DOM structure, which users expect. Positive tabindex values create a complex focus order where lower numbers are focused first, then tabindex="0" elements, then remaining interactive elements. This makes the tab order unpredictable and hard to maintain. Users with motor disabilities who rely on keyboard navigation will struggle with illogical focus orders. Instead, use tabindex="0" to add elements to the natural tab order, tabindex="-1" to remove them, and structure your DOM in a logical order. This is a WCAG Level A requirement.',
};
