"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeValue = getAttributeValue;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const constants_1 = require("./constants");
const get_original_attribute_name_1 = require("./get-original-attribute-name");
/**
 * Extracts the attribute value.
 * @example
 * ```ts
 * getAttributeValue(Element(`<div property="test"></div>`), 'nonExistent'); // null
 * getAttributeValue(Element(`<div aria-role="none"></div>`), 'role'); // 'none'
 * getAttributeValue(Element(`<div [attr.aria-checked]="true"></div>`), 'aria-checked'); // true
 * getAttributeValue(Element(`<button [variant]="variant"></button>`), 'variant'); // PROPERTY
 * ```
 */
function getAttributeValue({ attributes, inputs }, attributeName) {
    const attributeOrInput = [...attributes, ...inputs].find((attrOrInput) => (0, get_original_attribute_name_1.getOriginalAttributeName)(attrOrInput) === attributeName);
    if (typeof attributeOrInput?.value === 'string') {
        return attributeOrInput.value;
    }
    if (!(attributeOrInput?.value instanceof bundled_angular_compiler_1.ASTWithSource)) {
        return null;
    }
    if (attributeOrInput.value.ast instanceof bundled_angular_compiler_1.LiteralArray) {
        return attributeOrInput.value.ast.expressions;
    }
    if (attributeOrInput.value.ast instanceof bundled_angular_compiler_1.LiteralMap) {
        const { keys, values } = attributeOrInput.value.ast;
        return keys.reduce((current, next, index) => {
            return current.set(next.key, values[index]);
        }, new Map());
    }
    if (attributeOrInput.value.ast instanceof bundled_angular_compiler_1.LiteralPrimitive) {
        return attributeOrInput.value.ast.value;
    }
    return constants_1.PROPERTY_READ;
}
