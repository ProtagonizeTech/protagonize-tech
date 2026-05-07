import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
export interface PropInfo {
    name: string;
    leadingComments: string[];
    value: string;
    trailingComments: string[];
}
export declare function extractPropertyComments(sourceCode: Readonly<TSESLint.SourceCode>, properties: TSESTree.Property[], objectExpression: TSESTree.Expression, indentation: string): Map<string, PropInfo>;
export declare function buildSortedPropertiesWithComments(filteredOrder: string[], propInfoMap: Map<string, PropInfo>, indentation: string): string;
export declare function getObjectIndentation(sourceCode: Readonly<TSESLint.SourceCode>, objectExpression: TSESTree.Expression): string;
//# sourceMappingURL=comment-utils.d.ts.map