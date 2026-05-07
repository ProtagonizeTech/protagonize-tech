import type { TSESLint } from '@typescript-eslint/utils';
export type Options = [{
    readonly allowNullOrUndefined?: boolean;
}];
export type MessageIds = 'eqeqeq' | 'suggestStrictEquality';
export declare const RULE_NAME = "eqeqeq";
declare const _default: TSESLint.RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, TSESLint.RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=eqeqeq.d.ts.map