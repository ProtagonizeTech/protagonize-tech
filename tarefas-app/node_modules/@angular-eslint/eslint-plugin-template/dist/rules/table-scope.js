"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const get_dom_elements_1 = require("../utils/get-dom-elements");
const to_pattern_1 = require("../utils/to-pattern");
exports.RULE_NAME = 'table-scope';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: '[Accessibility] Ensures that the `scope` attribute is only used on the `<th>` element',
        },
        fixable: 'code',
        schema: [],
        messages: {
            tableScope: 'The `scope` attribute should only be on the `<th>` element',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const domElements = [...(0, get_dom_elements_1.getDomElements)()].filter((domElement) => domElement !== 'th');
        const uppercaseDomElements = domElements.map((element) => element.toUpperCase());
        const domElementsPattern = (0, to_pattern_1.toPattern)([
            ...domElements,
            ...uppercaseDomElements,
        ]);
        return {
            [`Element[name=${domElementsPattern}] > :matches(BoundAttribute, TextAttribute)[name='scope']`]({ sourceSpan, }) {
                const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                context.report({
                    loc,
                    messageId: 'tableScope',
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
    rationale: 'The scope attribute on table headers (<th>) tells screen readers whether a header applies to a column or row, enabling more efficient table navigation. When screen reader users navigate table cells, the screen reader announces the associated headers. Without proper scope attributes, users must manually explore the table structure to understand what each cell represents. Use scope="col" for column headers and scope="row" for row headers. For simple tables, screen readers can often infer the scope, but explicit scope attributes ensure reliable accessibility across all screen readers.',
};
