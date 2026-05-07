"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributesComparator = attributesComparator;
const get_attribute_value_1 = require("./get-attribute-value");
function attributesComparator(ariaRoleRelationConceptAttributes, node) {
    const attributesInputs = [...node.attributes, ...node.inputs];
    return ariaRoleRelationConceptAttributes.every((ariaRoleRelationConceptAttribute) => attributesInputs.some(({ name }) => {
        if (node.name === 'a' && name === 'routerLink') {
            return true;
        }
        if (ariaRoleRelationConceptAttribute.name !== name) {
            return false;
        }
        return (!ariaRoleRelationConceptAttribute.value ||
            ariaRoleRelationConceptAttribute.value ===
                (0, get_attribute_value_1.getAttributeValue)(node, ariaRoleRelationConceptAttribute.name));
    }));
}
