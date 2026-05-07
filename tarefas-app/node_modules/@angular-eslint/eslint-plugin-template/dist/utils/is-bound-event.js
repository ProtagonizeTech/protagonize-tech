"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoundEvent = isBoundEvent;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
/**
 * Type guard to check if a node is a TmplAstBoundEvent (output event handler)
 */
function isBoundEvent(node) {
    return node instanceof bundled_angular_compiler_1.TmplAstBoundEvent;
}
