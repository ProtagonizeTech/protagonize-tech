export type Options = [
    {
        prefixes: string[];
    }
];
export type MessageIds = 'pipePrefix' | 'selectorAfterPrefixFailure';
export declare const RULE_NAME = "pipe-prefix";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=pipe-prefix.d.ts.map