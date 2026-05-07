"use strict";
/**
 * ===============================================================================
 *
 * This file contains general purpose utilities which are not specific to one of
 * the plugins.
 *
 * ===============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPattern = exports.toHumanReadableText = exports.kebabToCamelCase = exports.isNotNullOrUndefined = exports.objectKeys = void 0;
exports.getLast = getLast;
exports.arrayify = arrayify;
exports.capitalize = capitalize;
exports.withoutBracketsAndWhitespaces = withoutBracketsAndWhitespaces;
/**
 * Return the last item of the given array.
 */
function getLast(items) {
    return items.slice(-1)[0];
}
exports.objectKeys = Object.keys;
/**
 * Enforces the invariant that the input is an array.
 */
function arrayify(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return (value ? [value] : []);
}
// Needed because in the current Typescript version (TS 3.3.3333), Boolean() cannot be used to perform a null check.
// For more, see: https://github.com/Microsoft/TypeScript/issues/16655
const isNotNullOrUndefined = (input) => input !== null && input !== undefined;
exports.isNotNullOrUndefined = isNotNullOrUndefined;
const kebabToCamelCase = (value) => value.replace(/-[a-zA-Z]/g, ({ 1: letterAfterDash }) => letterAfterDash.toUpperCase());
exports.kebabToCamelCase = kebabToCamelCase;
/**
 * Convert an array to human-readable text.
 */
const toHumanReadableText = (items) => {
    const itemsLength = items.length;
    if (itemsLength === 1) {
        return `"${items[0]}"`;
    }
    return `${items
        .map((item) => `"${item}"`)
        .slice(0, itemsLength - 1)
        .join(', ')} or "${[...items].pop()}"`;
};
exports.toHumanReadableText = toHumanReadableText;
const toPattern = (value) => RegExp(`^(${value.join('|')})$`);
exports.toPattern = toPattern;
function capitalize(text) {
    return `${text[0].toUpperCase()}${text.slice(1)}`;
}
function withoutBracketsAndWhitespaces(text) {
    return text.replace(/[[\]\s]/g, '');
}
