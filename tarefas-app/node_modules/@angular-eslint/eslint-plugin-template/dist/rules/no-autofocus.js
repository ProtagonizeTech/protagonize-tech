"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const to_pattern_1 = require("../utils/to-pattern");
exports.RULE_NAME = 'no-autofocus';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures that the `autofocus` attribute is not used',
        },
        fixable: 'code',
        schema: [],
        messages: {
            noAutofocus: 'The `autofocus` attribute should not be used, as it reduces usability and accessibility for users',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const elementNamePattern = (0, to_pattern_1.toPattern)([...(0, get_dom_elements_1.getDomElements)()]);
        return {
            [`Element[name=${elementNamePattern}] > :matches(BoundAttribute, TextAttribute)[name="autofocus"]`]({ sourceSpan, }) {
                const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                context.report({
                    loc,
                    messageId: 'noAutofocus',
                    fix: (fixer) => fixer.removeRange([
                        sourceSpan.start.offset - 1,
                        sourceSpan.end.offset,
                    ]),
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "The autofocus attribute automatically moves focus to an element when the page loads, which can be disorienting and problematic for accessibility. For screen reader users, autofocus disrupts their normal navigation flow and can cause them to miss important page content. For users with motor disabilities, unexpected focus changes can be confusing. For users with cognitive disabilities, the auto-focused element might grab attention before they've had a chance to understand the page structure. Additionally, autofocus can interfere with browser features like scroll restoration. If focus management is needed, implement it through Angular lifecycle hooks with proper context awareness rather than using the autofocus attribute.",
};
