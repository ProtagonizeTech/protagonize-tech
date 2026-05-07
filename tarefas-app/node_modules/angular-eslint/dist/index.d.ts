import type { Plugin as ESLintPlugin } from '@eslint/core';
import type { TSESLint } from '@typescript-eslint/utils';
import type { Linter } from 'eslint';
declare const templateParser: TSESLint.FlatConfig.Parser;
/**
 * Make the plugins compatible with both ESLint's Plugin type and typescript-eslint's
 * FlatConfig.Plugin type through type assertion.
 *
 * This is covered by a type compatibility test in tests/type-compatibility.test.ts
 */
type CompatiblePlugin = Omit<ESLintPlugin, 'configs'> & {
    configs?: never;
};
declare const tsPlugin: CompatiblePlugin;
declare const templatePlugin: CompatiblePlugin;
/**
 * Type that is compatible with both ESLint's defineConfig and typescript-eslint's config
 * by using the intersection of both config array types
 */
type CompatibleConfigArray = TSESLint.FlatConfig.ConfigArray & Linter.Config[];
declare const configs: {
    tsAll: CompatibleConfigArray;
    tsRecommended: CompatibleConfigArray;
    templateAll: CompatibleConfigArray;
    templateRecommended: CompatibleConfigArray;
    templateAccessibility: CompatibleConfigArray;
};
declare const processInlineTemplates: import("@eslint/core").Processor<string | import("@eslint/core").ProcessorFile> | undefined;
declare const _default: {
    configs: {
        tsAll: CompatibleConfigArray;
        tsRecommended: CompatibleConfigArray;
        templateAll: CompatibleConfigArray;
        templateRecommended: CompatibleConfigArray;
        templateAccessibility: CompatibleConfigArray;
    };
    tsPlugin: CompatiblePlugin;
    templateParser: {
        meta?: { [K in keyof TSESLint.Parser.ParserMeta]?: TSESLint.Parser.ParserMeta[K] | undefined; };
        parseForESLint(text: string, options?: unknown): { [k in keyof TSESLint.Parser.ParseResult]: unknown; };
    };
    templatePlugin: CompatiblePlugin;
    processInlineTemplates: import("@eslint/core").Processor<string | import("@eslint/core").ProcessorFile> | undefined;
};
export default _default;
export { configs, templateParser, templatePlugin, tsPlugin, processInlineTemplates, };
//# sourceMappingURL=index.d.ts.map