import type { ParseSourceSpan, TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
export declare function convertNodeSourceSpanToLoc(sourceSpan: ParseSourceSpan): TSESTree.SourceLocation;
export declare function convertElementSourceSpanToLoc(context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>, node: TmplAstElement & {
    type: string;
}): TSESTree.SourceLocation;
//# sourceMappingURL=convert-source-span-to-loc.d.ts.map