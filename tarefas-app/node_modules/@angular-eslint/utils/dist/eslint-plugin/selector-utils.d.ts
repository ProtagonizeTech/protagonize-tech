import { CssSelector } from '@angular-eslint/bundled-angular-compiler';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { SelectorStyle } from './ast-utils';
export declare const OPTION_TYPE_ATTRIBUTE = "attribute";
export declare const OPTION_TYPE_ATTRS = "attrs";
export declare const OPTION_TYPE_ELEMENT = "element";
export type SelectorStyleOption = SelectorStyle | string;
export type SelectorTypeOption = typeof OPTION_TYPE_ATTRIBUTE | typeof OPTION_TYPE_ELEMENT | string;
export type SelectorTypeInternal = typeof OPTION_TYPE_ATTRS | typeof OPTION_TYPE_ELEMENT;
export type SelectorPrefixOption = undefined | string | readonly string[];
export type SelectorConfig = {
    readonly type: SelectorTypeOption;
    readonly prefix: SelectorPrefixOption;
    readonly style: SelectorStyleOption;
};
export type SingleConfigOption = Options[number];
export type MultipleConfigOption = readonly SelectorConfig[];
export type RuleOptions = readonly [SingleConfigOption | MultipleConfigOption];
export type Options = [
    {
        readonly type: SelectorTypeOption | readonly SelectorTypeOption[];
        readonly prefix: SelectorPrefixOption;
        readonly style: SelectorTypeOption;
    }
];
export declare const SelectorValidator: {
    attribute(selector: string): boolean;
    camelCase(selector: string): boolean;
    element(selector: string): boolean;
    kebabCase(selector: string): boolean;
    prefixRegex(prefix: string): RegExp;
    prefix(prefix: string, selectorStyle: string): (selector: string) => boolean;
    selectorAfterPrefix(prefix: string): (selector: string) => boolean;
};
export declare const reportPrefixError: (node: TSESTree.Node, prefix: SelectorPrefixOption, context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) => void;
export declare const reportSelectorAfterPrefixError: (node: TSESTree.Node, prefix: SelectorPrefixOption, context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) => void;
export declare const reportStyleError: (node: TSESTree.Node, style: SelectorStyleOption, context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) => void;
export declare const reportStyleAndPrefixError: (node: TSESTree.Node, style: SelectorStyleOption, prefix: SelectorPrefixOption, context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) => void;
export declare const reportTypeError: (node: TSESTree.Node, type: SelectorTypeOption | readonly SelectorTypeOption[], context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) => void;
export declare const parseSelectorNode: (node: TSESTree.Node) => readonly CssSelector[] | null;
export declare const getActualSelectorType: (node: TSESTree.Node) => SelectorTypeOption | null;
export declare const checkValidOptions: (type: SelectorTypeOption | readonly SelectorTypeOption[], prefix: SelectorPrefixOption, style: SelectorStyleOption) => boolean;
export declare const checkSelector: (node: TSESTree.Node, typeOption: SelectorTypeOption | readonly SelectorTypeOption[], prefixOption: SelectorPrefixOption, styleOption: SelectorStyle, parsedSelectors?: readonly CssSelector[] | null) => {
    readonly hasExpectedPrefix: boolean;
    readonly hasExpectedType: boolean;
    readonly hasExpectedStyle: boolean;
    readonly hasSelectorAfterPrefix: boolean;
} | null;
export declare const isMultipleConfigOption: (option: SingleConfigOption | MultipleConfigOption) => option is MultipleConfigOption;
export declare const normalizeOptionsToConfigs: (option: SingleConfigOption | MultipleConfigOption) => Map<string, SelectorConfig>;
/**
 * Get the applicable config for a given selector node
 */
export declare const getApplicableConfig: (rawSelectors: TSESTree.Node, configByType: Map<string, SelectorConfig>) => SelectorConfig | null;
//# sourceMappingURL=selector-utils.d.ts.map