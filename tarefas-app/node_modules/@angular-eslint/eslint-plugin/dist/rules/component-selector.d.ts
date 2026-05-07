import { SelectorUtils } from '@angular-eslint/utils';
export type Options = readonly [
    SelectorUtils.SingleConfigOption | SelectorUtils.MultipleConfigOption
];
export type MessageIds = 'prefixFailure' | 'styleFailure' | 'styleAndPrefixFailure' | 'typeFailure' | 'shadowDomEncapsulatedStyleFailure' | 'selectorAfterPrefixFailure';
export declare const RULE_NAME = "component-selector";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=component-selector.d.ts.map