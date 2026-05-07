import type { AST, TmplAstNode } from '@angular-eslint/bundled-angular-compiler';
type ASTOrNodeWithParent = (AST | TmplAstNode) & {
    parent?: ASTOrNodeWithParent;
};
export declare function getNearestNodeFrom<T extends ASTOrNodeWithParent>({ parent }: ASTOrNodeWithParent, predicate: (parent: ASTOrNodeWithParent) => parent is T): T | null;
export {};
//# sourceMappingURL=get-nearest-node-from.d.ts.map