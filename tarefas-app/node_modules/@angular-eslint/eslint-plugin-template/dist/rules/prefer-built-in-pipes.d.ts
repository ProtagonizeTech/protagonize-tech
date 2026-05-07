export type Options = [
    {
        readonly disallowList?: readonly string[];
        readonly allowInOutputHandlers?: boolean;
    }
];
export type MessageIds = 'preferBuiltInPipes';
export declare const RULE_NAME = "prefer-built-in-pipes";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<"preferBuiltInPipes", Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=prefer-built-in-pipes.d.ts.map