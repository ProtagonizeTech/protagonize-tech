export type Options = [
    {
        readonly ignoreWithDirectives?: string[];
    }
];
export type MessageIds = 'invalidType' | 'missingType';
export declare const RULE_NAME = "button-has-type";
export declare const INVALID_TYPE_DATA_KEY = "type";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=button-has-type.d.ts.map