"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapParenthesizedExpression = unwrapParenthesizedExpression;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
function unwrapParenthesizedExpression(node) {
    return node instanceof bundled_angular_compiler_1.ParenthesizedExpression ? node.expression : node;
}
