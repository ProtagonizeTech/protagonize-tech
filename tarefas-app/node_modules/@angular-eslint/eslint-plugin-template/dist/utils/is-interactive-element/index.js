"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInherentlyInteractiveElement = isInherentlyInteractiveElement;
exports.isNonInteractiveRole = isNonInteractiveRole;
const attributes_comparator_1 = require("../attributes-comparator");
const get_attribute_value_1 = require("../get-attribute-value");
const get_dom_elements_1 = require("../get-dom-elements");
const get_interactive_element_ax_object_schemas_1 = require("./get-interactive-element-ax-object-schemas");
const get_interactive_element_role_schemas_1 = require("./get-interactive-element-role-schemas");
const get_non_interactive_element_role_schemas_1 = require("./get-non-interactive-element-role-schemas");
function checkIsInteractiveElement(node) {
    function elementSchemaMatcher({ attributes, name }) {
        return (node.name.toLowerCase() === name &&
            (0, attributes_comparator_1.attributesComparator)(attributes ?? [], node));
    }
    // Check in elementRoles for inherent interactive role associations for
    // this element.
    const isInherentInteractiveElement = (0, get_interactive_element_role_schemas_1.getInteractiveElementRoleSchemas)().some(elementSchemaMatcher);
    if (isInherentInteractiveElement) {
        return true;
    }
    // Check in elementRoles for inherent non-interactive role associations for
    // this element.
    const isInherentNonInteractiveElement = (0, get_non_interactive_element_role_schemas_1.getNonInteractiveElementRoleSchemas)().some(elementSchemaMatcher);
    if (isInherentNonInteractiveElement) {
        return false;
    }
    // Check in elementAXObjects for AX Tree associations for this element.
    return (0, get_interactive_element_ax_object_schemas_1.getInteractiveElementAXObjectSchemas)().some(elementSchemaMatcher);
}
function checkIsNonInteractiveRole(node) {
    return (0, get_non_interactive_element_role_schemas_1.getNonInteractiveRoles)().has((0, get_attribute_value_1.getAttributeValue)(node, 'role'));
}
/**
 * Returns boolean indicating whether the given element is
 * interactive on the DOM or not. Usually used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * it's intention is to be interacted with on the DOM.
 */
function isInherentlyInteractiveElement(node) {
    return ((0, get_dom_elements_1.getDomElements)().has(node.name.toLowerCase()) &&
        checkIsInteractiveElement(node));
}
function isNonInteractiveRole(node) {
    return checkIsNonInteractiveRole(node);
}
