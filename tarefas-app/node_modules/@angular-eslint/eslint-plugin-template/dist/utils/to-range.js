"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRange = toRange;
exports.toZeroLengthRange = toZeroLengthRange;
function toRange(span) {
    return [span.start.offset, span.end.offset];
}
function toZeroLengthRange(offset) {
    return [offset, offset];
}
