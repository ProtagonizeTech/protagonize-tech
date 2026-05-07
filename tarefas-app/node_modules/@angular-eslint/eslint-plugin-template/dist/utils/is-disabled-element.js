"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDisabledElement = isDisabledElement;
const get_original_attribute_name_1 = require("./get-original-attribute-name");
const get_attribute_value_1 = require("./get-attribute-value");
function isDisabledElement(node) {
    const attributesInputs = [...node.attributes, ...node.inputs];
    const disabledAttr = attributesInputs.find((attr) => (0, get_original_attribute_name_1.getOriginalAttributeName)(attr) === 'disabled');
    const disabledValue = (0, get_attribute_value_1.getAttributeValue)(node, 'disabled');
    const isHTML5Disabled = disabledAttr && disabledValue !== undefined;
    if (isHTML5Disabled) {
        return true;
    }
    const isAriaDisabled = String((0, get_attribute_value_1.getAttributeValue)(node, 'aria-disabled')).toLowerCase() === 'true';
    if (isAriaDisabled) {
        return true;
    }
    return false;
}
