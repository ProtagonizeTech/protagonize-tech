"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomElements = getDomElements;
const aria_query_1 = require("aria-query");
const nonAriaElements = [
    'slot',
    'rb',
    'template',
    // The Angular compiler has special handling for math and svg as namespaces. Their children have the namespace in the node name too.
    ':svg:svg',
    ':math:math',
];
let domElements = null;
function getDomElements() {
    return (domElements ?? (domElements = new Set([...aria_query_1.dom.keys(), ...nonAriaElements])));
}
