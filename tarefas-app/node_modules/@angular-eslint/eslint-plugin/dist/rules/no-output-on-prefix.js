"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-output-on-prefix';
const STYLE_GUIDE_LINK = 'https://angular.dev/guide/components/outputs#choosing-event-names';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Ensures that output bindings, including aliases, are not named "on", nor prefixed with it. See more at ${STYLE_GUIDE_LINK}`,
            recommended: 'recommended',
        },
        schema: [],
        messages: {
            noOutputOnPrefix: `Output bindings, including aliases, should not be named "on", nor prefixed with it (${STYLE_GUIDE_LINK})`,
        },
    },
    defaultOptions: [],
    create(context) {
        const outputOnPattern = /^on(([^a-z])|(?=$))/;
        const selectors = [
            utils_1.Selectors.OUTPUTS_METADATA_PROPERTY_LITERAL,
            utils_1.Selectors.OUTPUT_ALIAS,
            utils_1.Selectors.OUTPUT_PROPERTY_OR_GETTER,
        ].join(',');
        return {
            [selectors](node) {
                const [propertyName, aliasName] = utils_1.ASTUtils.getRawText(node)
                    .replace(/\s/g, '')
                    .split(':');
                if (!outputOnPattern.test(propertyName) &&
                    !outputOnPattern.test(aliasName)) {
                    return;
                }
                context.report({
                    node,
                    messageId: 'noOutputOnPrefix',
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Angular's template syntax allows both '(eventName)' and 'on-eventName' for event bindings. If you prefix an output with 'on', this creates awkward template syntax like '(onUserClick)' or the even more redundant 'on-onUserClick'. This violates the principle of least surprise and makes templates harder to read. Instead, name outputs as simple actions or events (like 'userClick'), which Angular templates will bind as '(userClick)' or 'on-userClick'.",
};
