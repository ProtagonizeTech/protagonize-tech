"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContentEditable = isContentEditable;
const get_original_attribute_name_1 = require("./get-original-attribute-name");
const get_attribute_value_1 = require("./get-attribute-value");
function isContentEditable(node) {
    const attributesInputs = [...node.attributes, ...node.inputs];
    const contentEditableAttr = attributesInputs.find((attr) => (0, get_original_attribute_name_1.getOriginalAttributeName)(attr) === 'contenteditable');
    const contentEditableValue = (0, get_attribute_value_1.getAttributeValue)(node, 'contenteditable');
    return (!!contentEditableAttr &&
        (contentEditableValue === '' ||
            String(contentEditableValue).toLowerCase() === 'true'));
}
