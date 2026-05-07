"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSemanticRoleElement = isSemanticRoleElement;
// The axobject-query package doesn't have type definitions, but this is what we're using from it here
let axElements = null;
let axRoles = null;
// This function follows the lazy initialization pattern.
// Since this is a top-level module (it will be included via `require`), we do not need to
// initialize the `nonInteractiveElementRoleSchemas` until the function is called
// for the first time, so we will not take up the memory.
function isSemanticRoleElement(element, role, elementAttributes) {
    if (axElements === null || axRoles === null) {
        const { AXObjectRoles, elementAXObjects } = require('axobject-query');
        axElements = elementAXObjects;
        axRoles = AXObjectRoles;
    }
    // elementAXObjects: HTML elements are mapped to their related AXConcepts concepts
    return Array.from(axElements?.keys() ?? []).some((htmlElement) => htmlElement.name === element &&
        (htmlElement.attributes ?? []).every((htmlElemAttr) => 
        // match every axElement html attributes to given elementAttributes
        elementAttributes.find((elemAttr) => htmlElemAttr.name === elemAttr.name &&
            htmlElemAttr.value === elemAttr.value)) &&
        // aria- properties are covered by the element's semantic role
        axElements?.get(htmlElement)?.find((roleName) => 
        // AXObjectRoles: AXObjects are mapped to their related ARIA concepts
        axRoles
            ?.get(roleName)
            ?.find((semanticRole) => semanticRole.name === role)));
}
