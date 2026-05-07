type Mode = 'array' | 'string';
export type Options = [mode: Mode];
export type MessageIds = 'useStylesArray' | 'useStylesString' | 'useStyleUrl' | 'useStyleUrls';
export declare const RULE_NAME = "consistent-component-styles";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=consistent-component-styles.d.ts.map