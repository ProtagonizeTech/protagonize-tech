"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPattern = toPattern;
function toPattern(value) {
    return RegExp(`^(${value.join('|')})$`);
}
