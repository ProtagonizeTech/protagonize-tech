import type { AST } from '@angular-eslint/bundled-angular-compiler';
/**
 * Type guard to check if an AST node has a name property
 */
export declare function isASTWithName(ast: AST & {
    name?: string;
}): ast is AST & {
    name: string;
};
//# sourceMappingURL=is-ast-with-name.d.ts.map