import type { ParserServicesWithTypeInformation, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';
export type CallLikeNode = TSESTree.CallExpression | TSESTree.NewExpression | TSESTree.TaggedTemplateExpression;
export declare function getCallLikeNode(node: TSESTree.Node): CallLikeNode | undefined;
export declare function getSymbols(node: TSESTree.Identifier, services: ParserServicesWithTypeInformation, checker: ts.TypeChecker): (ts.Symbol | undefined)[];
export declare function isNodeCalleeOfParent(node: TSESTree.Node): node is CallLikeNode;
export declare function hasJsDocTag(symbols: (ts.Symbol | undefined)[], tagName: string): boolean;
export declare function getCallLikeNodeSymbol(node: CallLikeNode, services: ParserServicesWithTypeInformation, checker: ts.TypeChecker): ts.Symbol | undefined;
export declare function isDeclaration(node: TSESTree.Identifier): boolean;
export declare function isInsideExportOrImport(node: TSESTree.Node): boolean;
//# sourceMappingURL=jsdoc.d.ts.map