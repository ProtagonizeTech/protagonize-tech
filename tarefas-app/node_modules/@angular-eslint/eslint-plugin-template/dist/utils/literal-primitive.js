"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLiteralPrimitive = isLiteralPrimitive;
exports.isStringLiteralPrimitive = isStringLiteralPrimitive;
exports.getLiteralPrimitiveStringValue = getLiteralPrimitiveStringValue;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
function isLiteralPrimitive(node) {
    return node instanceof bundled_angular_compiler_1.LiteralPrimitive;
}
function isStringLiteralPrimitive(node) {
    return isLiteralPrimitive(node) && typeof node.value === 'string';
}
function getLiteralPrimitiveStringValue(node, quote) {
    return typeof node.value === 'string'
        ? `${node.value.replaceAll(quote, `\\${quote}`)}`
        : String(node.value);
}
