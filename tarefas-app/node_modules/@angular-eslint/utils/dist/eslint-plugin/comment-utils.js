"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPropertyComments = extractPropertyComments;
exports.buildSortedPropertiesWithComments = buildSortedPropertiesWithComments;
exports.getObjectIndentation = getObjectIndentation;
function extractPropertyComments(sourceCode, properties, objectExpression, indentation) {
    const allComments = sourceCode.getAllComments();
    const processedCommentRanges = new Set();
    const propInfoMap = new Map();
    const commentLineMap = new Map();
    for (const comment of allComments) {
        const line = sourceCode.getLocFromIndex(comment.range[0]).line;
        if (!commentLineMap.has(line)) {
            commentLineMap.set(line, []);
        }
        commentLineMap.get(line)?.push(comment);
    }
    const makeRangeKey = (start, end) => `${start}-${end}`;
    for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        const name = prop.key.name;
        const propRange = prop.range;
        const leadingComments = [];
        const prevPropEnd = i > 0 ? properties[i - 1].range[1] : objectExpression.range[0] + 1;
        for (const comment of allComments) {
            const rangeKey = makeRangeKey(comment.range[0], comment.range[1]);
            if (comment.range[0] > prevPropEnd &&
                comment.range[0] < propRange[0] &&
                !processedCommentRanges.has(rangeKey)) {
                leadingComments.push(indentation + sourceCode.getText(comment));
                processedCommentRanges.add(rangeKey);
            }
        }
        const propText = sourceCode.getText(prop).replace(/,\s*$/, '');
        const trailingComments = [];
        const propEndLine = sourceCode.getLocFromIndex(propRange[1]).line;
        if (commentLineMap.has(propEndLine)) {
            const commentsOnLine = commentLineMap.get(propEndLine) || [];
            for (const comment of commentsOnLine) {
                const rangeKey = makeRangeKey(comment.range[0], comment.range[1]);
                if (comment.range[0] > propRange[1] &&
                    !processedCommentRanges.has(rangeKey)) {
                    const spaceBefore = sourceCode
                        .getText()
                        .substring(propRange[1], comment.range[0])
                        .replace(/,/g, '');
                    trailingComments.push(spaceBefore + sourceCode.getText(comment));
                    processedCommentRanges.add(rangeKey);
                }
            }
        }
        propInfoMap.set(name, {
            name,
            leadingComments,
            value: propText,
            trailingComments,
        });
    }
    return propInfoMap;
}
function buildSortedPropertiesWithComments(filteredOrder, propInfoMap, indentation) {
    const sortedParts = [];
    for (let i = 0; i < filteredOrder.length; i++) {
        const propName = filteredOrder[i];
        const info = propInfoMap.get(propName);
        if (info) {
            if (info.leadingComments.length > 0) {
                sortedParts.push(...info.leadingComments);
            }
            const isLast = i === filteredOrder.length - 1;
            let finalPropText = indentation + info.value;
            if (!isLast) {
                finalPropText += ',';
            }
            if (info.trailingComments.length > 0) {
                info.trailingComments.forEach((comment) => {
                    finalPropText += comment;
                });
            }
            sortedParts.push(finalPropText);
        }
    }
    return sortedParts.join('\n');
}
function getObjectIndentation(sourceCode, objectExpression) {
    const objectExpressionText = sourceCode.getText(objectExpression);
    const lines = objectExpressionText.split('\n');
    return lines[1] ? lines[1].match(/^\s*/)?.[0] || '' : '';
}
