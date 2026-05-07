export type Options = [
    {
        readonly allowList?: readonly string[];
        readonly allowPrefix?: string;
        readonly allowSuffix?: string;
    }
];
export type MessageIds = 'noCallExpression';
export declare const RULE_NAME = "no-call-expression";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<"noCallExpression", Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=no-call-expression.d.ts.map