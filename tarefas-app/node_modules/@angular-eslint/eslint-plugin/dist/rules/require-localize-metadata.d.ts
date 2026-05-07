export type Options = [
    {
        readonly requireDescription?: boolean;
        readonly requireMeaning?: boolean;
        readonly requireCustomId?: boolean | string;
    }
];
export type MessageIds = 'requireLocalizeDescription' | 'requireLocalizeMeaning' | 'requireLocalizeCustomId';
export declare const RULE_NAME = "require-localize-metadata";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=require-localize-metadata.d.ts.map