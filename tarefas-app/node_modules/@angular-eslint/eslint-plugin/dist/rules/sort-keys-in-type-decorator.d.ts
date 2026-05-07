import { TSESLint } from '@typescript-eslint/utils';
export type Options = [
    {
        [key: string]: string[];
    }
];
export type MessageIds = 'incorrectOrder';
export declare const RULE_NAME = "sort-keys-in-type-decorator";
declare const _default: TSESLint.RuleModule<"incorrectOrder", Options, import("../utils/create-eslint-rule").RuleDocs, TSESLint.RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=sort-keys-in-type-decorator.d.ts.map