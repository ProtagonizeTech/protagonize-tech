export type Options = [{
    readonly ignoreClassNamePattern?: string;
}];
export type MessageIds = 'useInjectableProvidedIn' | 'suggestInjector';
export declare const RULE_NAME = "use-injectable-provided-in";
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageIds, Options, import("../utils/create-eslint-rule").RuleDocs, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=use-injectable-provided-in.d.ts.map