"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const signals_1 = require("../utils/signals");
exports.RULE_NAME = 'no-uncalled-signals';
const CONDITIONAL_SELECTOR = [
    utils_1.AST_NODE_TYPES.ConditionalExpression,
    utils_1.AST_NODE_TYPES.DoWhileStatement,
    utils_1.AST_NODE_TYPES.ForStatement,
    utils_1.AST_NODE_TYPES.IfStatement,
    utils_1.AST_NODE_TYPES.SwitchCase,
    utils_1.AST_NODE_TYPES.WhileStatement,
].join(',');
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: "Warns user about unintentionally doing logic on the signal, rather than the signal's value",
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            noUncalledSignals: 'Doing logic operations on signals will give unexpected results, you probably want to invoke the signal to get its value',
            suggestCallSignal: 'Call this signal to get its value.',
        },
    },
    defaultOptions: [],
    create(context) {
        const services = utils_1.ESLintUtils.getParserServices(context);
        function checkForUncalledSignal(node) {
            // Unwrap negated expressions so that
            // we look at what was being negated.
            if (node.type === utils_1.AST_NODE_TYPES.UnaryExpression &&
                node.operator === '!') {
                node = node.argument;
            }
            const type = services.getTypeAtLocation(node);
            const identifierType = type.getSymbol()?.name;
            if (identifierType && signals_1.KNOWN_SIGNAL_TYPES.has(identifierType)) {
                context.report({
                    node,
                    messageId: 'noUncalledSignals',
                    suggest: [
                        {
                            messageId: 'suggestCallSignal',
                            fix: (fixer) => fixer.insertTextAfter(node, '()'),
                        },
                    ],
                });
            }
        }
        return {
            [CONDITIONAL_SELECTOR](node) {
                if (node.test) {
                    checkForUncalledSignal(node.test);
                }
            },
            LogicalExpression(node) {
                checkForUncalledSignal(node.left);
                checkForUncalledSignal(node.right);
            },
            BinaryExpression(node) {
                checkForUncalledSignal(node.left);
                checkForUncalledSignal(node.right);
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Angular signals are functions that must be called to retrieve their value. A common mistake, especially for developers new to signals, is to use the signal itself in conditional or logical expressions without calling it first. For example, 'if (mySignal)' checks if the signal function exists (which is always true), not whether the signal's value is truthy. You need 'if (mySignal())' to check the value. This bug is easy to make because signals look like regular properties but behave like functions. The mistake leads to logic errors where conditions always evaluate incorrectly. This rule catches these mistakes by detecting when signals are used in conditionals, comparisons, or logical operations without being called.",
};
