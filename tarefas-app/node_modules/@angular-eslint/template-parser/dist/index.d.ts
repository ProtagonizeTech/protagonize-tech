import type { ParseError } from '@angular-eslint/bundled-angular-compiler';
import type { TSESTree } from '@typescript-eslint/types';
import { ScopeManager } from 'eslint-scope';
import { convertElementSourceSpanToLoc, convertNodeSourceSpanToLoc } from './convert-source-span-to-loc';
type NodeOrTokenType = any;
interface Node {
    [key: string]: any;
    type: NodeOrTokenType;
}
interface VisitorKeys {
    [nodeName: string]: string[];
}
interface Token extends TSESTree.BaseNode {
    type: NodeOrTokenType;
    value: string;
}
interface AST extends Node, Omit<Token, 'parent'> {
    comments: Token[];
    tokens: Token[];
    templateNodes: any[];
}
export declare class TemplateParseError extends Error {
    readonly fileName: string;
    readonly index: number;
    readonly lineNumber: number;
    readonly column: number;
    constructor(message: string, fileName: string, index: number, lineNumber: number, column: number);
}
export declare function createTemplateParseError(parseError: ParseError): TemplateParseError;
export interface ParserOptions {
    filePath: string;
    suppressParseErrors?: boolean;
}
declare function parseForESLint(code: string, options: ParserOptions): {
    ast: AST;
    scopeManager: InstanceType<typeof ScopeManager>;
    visitorKeys: VisitorKeys;
    services: {
        convertElementSourceSpanToLoc: typeof convertElementSourceSpanToLoc;
        convertNodeSourceSpanToLoc: typeof convertNodeSourceSpanToLoc;
    };
};
export { parseForESLint };
export declare function parse(code: string, options: ParserOptions): AST;
export declare const version: string;
export declare const meta: {
    name: string;
    version: string;
};
//# sourceMappingURL=index.d.ts.map