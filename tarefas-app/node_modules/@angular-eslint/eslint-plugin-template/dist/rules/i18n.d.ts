import type { TSESLint } from '@typescript-eslint/utils';
export type Options = [
    {
        readonly allowMarkupInContent?: boolean;
        readonly boundTextAllowedPattern?: string;
        readonly checkAttributes?: boolean;
        readonly checkDuplicateId?: boolean;
        readonly checkId?: boolean;
        readonly checkText?: boolean;
        readonly ignoreAttributes?: readonly string[];
        readonly ignoreTags?: readonly string[];
        readonly requireDescription?: boolean;
        readonly requireMeaning?: boolean;
    }
];
export type MessageIds = 'i18nAttribute' | 'i18nAttributeOnIcuOrText' | 'i18nCustomIdOnAttribute' | 'i18nCustomIdOnElement' | 'i18nDuplicateCustomId' | 'suggestAddI18nAttribute' | 'i18nMissingDescription' | 'i18nMissingMeaning' | 'i18nMarkupInContent';
export declare const RULE_NAME = "i18n";
declare const _default: TSESLint.RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, TSESLint.RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=i18n.d.ts.map