import { AST, LiteralPrimitive } from '@angular-eslint/bundled-angular-compiler';
export type Quote = "'" | '"' | '`';
export declare function isLiteralPrimitive(node: AST): node is LiteralPrimitive;
export declare function isStringLiteralPrimitive(node: AST): node is Omit<LiteralPrimitive, 'value'> & {
    value: string;
};
export declare function getLiteralPrimitiveStringValue(node: LiteralPrimitive, quote: Quote): string;
//# sourceMappingURL=literal-primitive.d.ts.map