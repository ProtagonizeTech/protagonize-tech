"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLengthRead = isLengthRead;
exports.isZero = isZero;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
function isLengthRead(node) {
    return node instanceof bundled_angular_compiler_1.PropertyRead && node.name === 'length';
}
function isZero(node) {
    return node instanceof bundled_angular_compiler_1.LiteralPrimitive && node.value === 0;
}
