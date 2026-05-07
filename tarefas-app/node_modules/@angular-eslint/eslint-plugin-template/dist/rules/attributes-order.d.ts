import type { TSESLint } from '@typescript-eslint/utils';
export declare enum OrderType {
    TemplateReferenceVariable = "TEMPLATE_REFERENCE",
    StructuralDirective = "STRUCTURAL_DIRECTIVE",
    AttributeBinding = "ATTRIBUTE_BINDING",
    InputBinding = "INPUT_BINDING",
    OutputBinding = "OUTPUT_BINDING",
    TwoWayBinding = "TWO_WAY_BINDING"
}
export type Options = [
    {
        readonly alphabetical: boolean;
        readonly order: readonly OrderType[];
    }
];
export type MessageIds = 'attributesOrder';
export declare const RULE_NAME = "attributes-order";
declare const _default: TSESLint.RuleModule<"attributesOrder", Options, import("../utils/create-eslint-rule").RuleDocs, TSESLint.RuleListener>;
export default _default;
export declare const RULE_DOCS_EXTENSION: {
    rationale: string;
};
//# sourceMappingURL=attributes-order.d.ts.map