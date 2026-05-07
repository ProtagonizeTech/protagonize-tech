import { ESLintUtils } from '@typescript-eslint/utils';
type Options = [
    {
        preferReadonlySignalProperties: boolean;
        preferInputSignals: boolean;
        preferQuerySignals: boolean;
        useTypeChecking: boolean;
        additionalSignalCreationFunctions: string[];
    }
];
export type MessageIds = 'preferInputSignals' | 'preferQuerySignals' | 'preferReadonlySignalProperties';
export declare const RULE_NAME = "prefer-signals";
declare const _default: ESLintUtils.RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, ESLintUtils.RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=prefer-signals.d.ts.map