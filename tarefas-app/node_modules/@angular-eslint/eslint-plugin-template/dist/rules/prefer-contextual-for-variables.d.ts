export type Options = [
    {
        readonly allowedAliases?: {
            $count?: readonly string[];
            $index?: readonly string[];
            $first?: readonly string[];
            $last?: readonly string[];
            $even?: readonly string[];
            $odd?: readonly string[];
        };
    }
];
export type MessageIds = 'preferContextualVariable' | 'preferCount' | 'preferFirst' | 'preferLast' | 'preferEven' | 'preferOdd';
export declare const RULE_NAME = "prefer-contextual-for-variables";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=prefer-contextual-for-variables.d.ts.map