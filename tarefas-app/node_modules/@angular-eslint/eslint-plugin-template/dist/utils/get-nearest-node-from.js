"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestNodeFrom = getNearestNodeFrom;
const types_1 = require("@typescript-eslint/types");
function isProgram(node) {
    return node.type === types_1.AST_NODE_TYPES.Program;
}
function getNearestNodeFrom({ parent }, predicate) {
    while (parent && !isProgram(parent)) {
        if (predicate(parent)) {
            return parent;
        }
        parent = parent.parent;
    }
    return null;
}
