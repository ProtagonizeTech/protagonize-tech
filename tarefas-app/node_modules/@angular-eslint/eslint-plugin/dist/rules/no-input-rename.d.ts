export type Options = [{
    readonly allowedNames?: readonly string[];
}];
export type MessageIds = 'noInputRename' | 'suggestRemoveAliasName' | 'suggestReplaceOriginalNameWithAliasName';
export declare const RULE_NAME = "no-input-rename";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=no-input-rename.d.ts.map