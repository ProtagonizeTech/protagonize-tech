import { SelectorUtils } from '@angular-eslint/utils';
export type Options = readonly [
    SelectorUtils.SingleConfigOption | SelectorUtils.MultipleConfigOption
];
export type MessageIds = 'prefixFailure' | 'styleFailure' | 'typeFailure' | 'selectorAfterPrefixFailure';
export declare const RULE_NAME = "directive-selector";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=directive-selector.d.ts.map