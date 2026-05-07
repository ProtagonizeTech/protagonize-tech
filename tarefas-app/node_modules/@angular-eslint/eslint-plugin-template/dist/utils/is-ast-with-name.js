"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isASTWithName = isASTWithName;
/**
 * Type guard to check if an AST node has a name property
 */
function isASTWithName(ast) {
    return !!ast.name;
}
