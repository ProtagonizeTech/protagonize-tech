"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChildNodeOf = isChildNodeOf;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
function isChildNodeOf(ast, childNodeName) {
    function traverseChildNodes({ children }) {
        return children.some((child) => child instanceof bundled_angular_compiler_1.TmplAstElement &&
            (child.name === childNodeName || traverseChildNodes(child)));
    }
    return traverseChildNodes(ast);
}
