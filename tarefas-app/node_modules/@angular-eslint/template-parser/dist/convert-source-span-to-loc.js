"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNodeSourceSpanToLoc = convertNodeSourceSpanToLoc;
exports.convertElementSourceSpanToLoc = convertElementSourceSpanToLoc;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
function convertNodeSourceSpanToLoc(sourceSpan) {
    return {
        start: {
            line: sourceSpan.start.line + 1,
            column: sourceSpan.start.col,
        },
        end: {
            line: sourceSpan.end.line + 1,
            column: sourceSpan.end.col,
        },
    };
}
function convertElementSourceSpanToLoc(context, node) {
    if (node.type !== 'Element') {
        // We explicitly throw an exception since this function should not be used
        // with non-element nodes, e.g. `TextAttribute` or `MethodDefinition`, etc.
        throw new Error('convertElementSourceSpanToLoc is intended to be used only with elements.');
    }
    // Void elements are "self-closed" elements, e.g. `<img />` or `<area />`.
    // The Angular compiler explicitly doesn't set the end source span for void
    // elements, but we still have to find its location to be able to report failures.
    if ((0, bundled_angular_compiler_1.getHtmlTagDefinition)(node.name).isVoid) {
        // Fallback to the original `node` if the
        // `tryToFindTheVoidNodeThatMatchesTheSourceSpan` returns nothing.
        node = (tryToFindTheVoidNodeThatMatchesTheSourceSpan(context, node) ||
            node);
    }
    return convertNodeSourceSpanToLoc(node.sourceSpan);
}
function tryToFindTheVoidNodeThatMatchesTheSourceSpan(context, node) {
    // Previously, `codelyzer` used `TemplateParser` to parse a template into an AST tree.
    // The `TemplateParser` used `HtmlParser`, because `HtmlParser` still sets the end span
    // for void elements.
    const { rootNodes } = getHtmlParser().parse(context.sourceCode.getText(), context.filename);
    return lookupTheVoidNode(rootNodes, node.sourceSpan);
}
function lookupTheVoidNode(rootNodes, sourceSpan) {
    for (const node of rootNodes) {
        if (
        // We can't compare by `node.sourceSpan == sourceSpan` since references
        // will differ. But comparing `line` and` offset` is the
        // correct way, because they will not differ.
        node.sourceSpan.start.line === sourceSpan.start.line &&
            node.sourceSpan.start.offset === sourceSpan.start.offset) {
            return node;
        }
        // `HtmlParser` will return a list of root nodes, these nodes
        // can be either text or elements. Elements might have child elements.
        if (node instanceof bundled_angular_compiler_1.Element) {
            const voidNodeBeingLookedUp = lookupTheVoidNode(node.children, sourceSpan);
            if (voidNodeBeingLookedUp !== null) {
                return voidNodeBeingLookedUp;
            }
        }
    }
    return null;
}
let htmlParser = null;
// Initialize the `HtmlParser` class lazily only when the function is
// invoked for the first time.
function getHtmlParser() {
    return htmlParser || (htmlParser = new bundled_angular_compiler_1.HtmlParser());
}
