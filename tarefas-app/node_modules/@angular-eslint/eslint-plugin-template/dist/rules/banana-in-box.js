"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'banana-in-box';
const INVALID_PATTERN = /\[(.*)\]/;
const VALID_CLOSE_BOX = ')]';
const VALID_OPEN_BOX = '[(';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that the two-way data binding syntax is correct',
            recommended: 'recommended',
        },
        fixable: 'code',
        schema: [],
        messages: {
            bananaInBox: 'Invalid binding syntax. Use [(expr)] instead',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const sourceCode = context.sourceCode;
        return {
            BoundEvent({ name, sourceSpan }) {
                const matches = name.match(INVALID_PATTERN);
                if (!matches)
                    return;
                const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);
                context.report({
                    messageId: 'bananaInBox',
                    loc,
                    fix: (fixer) => {
                        const [, textInTheBox] = matches;
                        const textToReplace = `${VALID_OPEN_BOX}${textInTheBox}${VALID_CLOSE_BOX}`;
                        const startIndex = sourceCode.getIndexFromLoc(loc.start);
                        return fixer.replaceTextRange([startIndex, startIndex + name.length + 2], textToReplace);
                    },
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: 'The Angular two-way binding syntax is [(ngModel)]="value", where the parentheses are INSIDE the brackets, resembling a banana in a box. A common typo is ([ngModel])="value" with the parentheses outside, which creates a one-way binding FROM the template TO the component (the opposite of what\'s intended). This will make the input update when the value changes but won\'t update the value when the user types. This syntax error is easy to make and can be hard to spot visually, but it breaks two-way data binding. The correct syntax is: [()] for two-way binding, [] for property binding (component to template), and () for event binding (template to component).',
};
