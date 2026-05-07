import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
export declare function getImportAddFix({ compatibleWithTypeOnlyImport, fixer, importName, moduleName, node, }: {
    compatibleWithTypeOnlyImport?: boolean;
    fixer: TSESLint.RuleFixer;
    importName: string;
    moduleName: string;
    node: TSESTree.Node;
}): TSESLint.RuleFix | undefined;
export declare function getImportRemoveFix(sourceCode: Readonly<TSESLint.SourceCode>, importDeclarations: readonly TSESTree.ImportDeclaration[], importName: string, fixer: TSESLint.RuleFixer): TSESLint.RuleFix | undefined;
export declare function getImplementsSchemaFixer({ id, superClass, implements: classImplements, typeParameters, }: TSESTree.ClassDeclaration, interfaceName: string): {
    readonly implementsNodeReplace: TSESTree.TSClassImplements | TSESTree.Identifier | TSESTree.TSTypeParameterDeclaration;
    readonly implementsTextReplace: string;
};
export declare function getDecoratorPropertyAddFix({ expression }: TSESTree.Decorator, fixer: TSESLint.RuleFixer, text: string): TSESLint.RuleFix | undefined;
export declare function getImplementsRemoveFix(sourceCode: Readonly<TSESLint.SourceCode>, classDeclaration: TSESTree.ClassDeclaration, interfaceName: string, fixer: TSESLint.RuleFixer): TSESLint.RuleFix | undefined;
export declare function getNodeToCommaRemoveFix(sourceCode: Readonly<TSESLint.SourceCode>, node: TSESTree.Node, fixer: TSESLint.RuleFixer): TSESLint.RuleFix;
//# sourceMappingURL=rule-fixes.d.ts.map