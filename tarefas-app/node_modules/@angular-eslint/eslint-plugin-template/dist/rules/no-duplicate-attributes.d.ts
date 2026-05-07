export type Options = [
    {
        readonly allowTwoWayDataBinding?: boolean;
        readonly allowStylePrecedenceDuplicates?: boolean;
        readonly ignore?: readonly string[];
    }
];
export type MessageIds = 'noDuplicateAttributes' | 'suggestRemoveAttribute';
export declare const RULE_NAME = "no-duplicate-attributes";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=no-duplicate-attributes.d.ts.map