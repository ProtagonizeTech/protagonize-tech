"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createESLintRule = void 0;
const utils_1 = require("@typescript-eslint/utils");
/**
 * We need to patch the RuleCreator in order to preserve the defaultOptions
 * to use as part of documentation generation.
 */
const patchedRuleCreator = (urlCreator) => {
    return function createRule({ name, meta, defaultOptions, create }) {
        return {
            meta: Object.assign(Object.assign({}, meta), {
                docs: Object.assign(Object.assign({}, meta.docs), {
                    url: urlCreator(name),
                }),
            }),
            defaultOptions,
            create(context) {
                const optionsWithDefault = utils_1.ESLintUtils.applyDefault(defaultOptions, context.options);
                return create(context, optionsWithDefault);
            },
        };
    };
};
patchedRuleCreator.withoutDocs = utils_1.ESLintUtils.RuleCreator.withoutDocs;
exports.createESLintRule = patchedRuleCreator((ruleName) => `https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/${ruleName}.md`);
