import { ESLintUtils } from '@typescript-eslint/utils';
export interface RuleDocs {
    recommended?: string;
}
export declare const createESLintRule: <Options extends readonly unknown[], MessageIds extends string>({ meta, name, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, RuleDocs>>) => ESLintUtils.RuleModule<MessageIds, Options, RuleDocs, ESLintUtils.RuleListener>;
//# sourceMappingURL=create-eslint-rule.d.ts.map