"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.version = exports.TemplateParseError = void 0;
exports.createTemplateParseError = createTemplateParseError;
exports.parseForESLint = parseForESLint;
exports.parse = parse;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const eslint_scope_1 = require("eslint-scope");
const convert_source_span_to_loc_1 = require("./convert-source-span-to-loc");
const KEYS = {
    ASTWithSource: ['ast'],
    Binary: ['left', 'right'],
    BoundAttribute: ['value'],
    BoundEvent: ['handler'],
    BoundText: ['value'],
    Call: ['receiver', 'args'],
    SafeCall: ['receiver', 'args'],
    Conditional: ['condition', 'trueExp', 'falseExp'],
    Element: ['children', 'inputs', 'outputs', 'attributes'],
    Interpolation: ['expressions'],
    PrefixNot: ['expression'],
    Program: ['templateNodes'],
    PropertyRead: ['receiver'],
    Template: ['templateAttrs', 'children', 'inputs'],
    BindingPipe: ['exp'],
    DeferredBlock: [
        'children',
        'placeholder',
        'loading',
        'error',
        'triggers',
        'prefetchTriggers',
    ],
    DeferredBlockLoading: ['children'],
    DeferredBlockError: ['children'],
    DeferredBlockPlaceholder: ['children'],
    Object: ['when'],
    BoundDeferredTrigger: ['value'],
    IfBlock: ['branches'],
    IfBlockBranch: ['children', 'expression'],
    SwitchBlock: ['cases', 'expression'],
    SwitchBlockCase: ['children', 'expression'],
    ForLoopBlock: ['children', 'empty', 'expression', 'trackBy'],
    ForLoopBlockEmpty: ['children'],
    Content: ['children'],
    LetDeclaration: ['value'],
    ParenthesizedExpression: ['expression'],
};
function fallbackKeysFilter(key) {
    let value = null;
    return (key !== 'comments' &&
        key !== 'leadingComments' &&
        key !== 'loc' &&
        key !== 'parent' &&
        key !== 'range' &&
        key !== 'tokens' &&
        key !== 'trailingComments' &&
        (value = this[key]) !== null &&
        typeof value === 'object' &&
        (typeof value.type === 'string' || Array.isArray(value)));
}
function getFallbackKeys(node) {
    return Object.keys(node).filter(fallbackKeysFilter, node);
}
function isNode(node) {
    return (node !== null &&
        typeof node === 'object' &&
        typeof node.type === 'string');
}
/**
 * Get line offsets for a source code string (cached for performance)
 */
let lineOffsetsCache = null;
function getLineOffsets(sourceCode) {
    if (!lineOffsetsCache) {
        lineOffsetsCache = new Map();
    }
    let offsets = lineOffsetsCache.get(sourceCode);
    if (!offsets) {
        offsets = [0];
        for (let i = 0; i < sourceCode.length; i++) {
            if (sourceCode[i] === '\n') {
                offsets.push(i + 1);
            }
        }
        lineOffsetsCache.set(sourceCode, offsets);
    }
    return offsets;
}
/**
 * Convert absolute offsets to line/column positions
 */
function convertAbsoluteSourceSpanToLoc(sourceCode, span) {
    const lineOffsets = getLineOffsets(sourceCode);
    // Binary search for start line
    let startLine = 0;
    let left = 0;
    let right = lineOffsets.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (lineOffsets[mid] <= span.start) {
            startLine = mid;
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    const startColumn = span.start - lineOffsets[startLine];
    // Binary search for end line
    let endLine = startLine; // Start from startLine as optimization
    left = startLine;
    right = lineOffsets.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (lineOffsets[mid] <= span.end) {
            endLine = mid;
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    const endColumn = span.end - lineOffsets[endLine];
    return {
        start: { line: startLine + 1, column: startColumn },
        end: { line: endLine + 1, column: endColumn },
    };
}
/**
 * ESLint requires all Nodes to have `type` and `loc` properties before it can
 * work with the custom AST.
 */
function preprocessNode(node, sourceCode) {
    let i = 0;
    let j = 0;
    const keys = KEYS[node.type] || getFallbackKeys(node);
    if (!node.loc) {
        if (node.sourceSpan &&
            node.sourceSpan.start &&
            typeof node.sourceSpan.start.line === 'number') {
            // Regular ParseSourceSpan
            node.loc = (0, convert_source_span_to_loc_1.convertNodeSourceSpanToLoc)(node.sourceSpan);
        }
        else if (node.sourceSpan &&
            typeof node.sourceSpan.start === 'number' &&
            sourceCode) {
            // AbsoluteSourceSpan
            node.loc = convertAbsoluteSourceSpanToLoc(sourceCode, node.sourceSpan);
        }
    }
    for (i = 0; i < keys.length; ++i) {
        const child = node[keys[i]];
        if (child == null) {
            continue;
        }
        const isArr = Array.isArray(child);
        if (child.type !== undefined) {
            // Angular sometimes uses a prop called type already
            child.__originalType = child.type;
        }
        if (!isArr && !child.type) {
            child.type = child.constructor.name;
        }
        if (isArr) {
            for (j = 0; j < child.length; ++j) {
                const c = child[j];
                if (c.type !== undefined) {
                    // Angular sometimes uses a prop called type already
                    c.__originalType = c.type;
                }
                // Pay attention to the condition `typeof c.type === number`,
                // Angular compiler sets `type` property for some AST nodes,
                // e.g. for the `BoundAttribute`, which is a `BindingType`.
                if (!c.type || typeof c.type === 'number') {
                    c.type = c.constructor.name;
                }
                if (isNode(c)) {
                    preprocessNode(c, sourceCode);
                }
            }
        }
        else if (isNode(child)) {
            preprocessNode(child, sourceCode);
        }
    }
}
function getStartSourceSpanFromAST(ast) {
    let startSourceSpan = null;
    ast.templateNodes.forEach((node) => {
        const nodeSourceSpan = node.startSourceSpan || node.sourceSpan;
        if (!startSourceSpan) {
            startSourceSpan = nodeSourceSpan;
            return;
        }
        if (nodeSourceSpan &&
            nodeSourceSpan.start.offset < startSourceSpan.start.offset) {
            startSourceSpan = nodeSourceSpan;
            return;
        }
    });
    return startSourceSpan;
}
function getEndSourceSpanFromAST(ast) {
    let endSourceSpan = null;
    ast.templateNodes.forEach((node) => {
        const nodeSourceSpan = node.endSourceSpan || node.sourceSpan;
        if (!endSourceSpan) {
            endSourceSpan = nodeSourceSpan;
            return;
        }
        if (nodeSourceSpan &&
            nodeSourceSpan.end.offset > endSourceSpan.end.offset) {
            endSourceSpan = nodeSourceSpan;
            return;
        }
    });
    return endSourceSpan;
}
function convertNgAstCommentsToTokens(comments) {
    const commentTokens = comments.map((comment) => {
        return {
            // In an HTML context, effectively all our comments are Block comments
            type: 'Block',
            value: comment.value,
            loc: (0, convert_source_span_to_loc_1.convertNodeSourceSpanToLoc)(comment.sourceSpan),
            range: [comment.sourceSpan.start.offset, comment.sourceSpan.end.offset],
        };
    });
    /**
     * ESLint requires this to be sorted by Token#range[0]
     * https://eslint.org/docs/developer-guide/working-with-custom-parsers
     */
    return commentTokens.sort((a, b) => a.range[0] - b.range[0]);
}
class TemplateParseError extends Error {
    fileName;
    index;
    lineNumber;
    column;
    constructor(message, fileName, index, lineNumber, column) {
        super(message);
        this.fileName = fileName;
        this.index = index;
        this.lineNumber = lineNumber;
        this.column = column;
        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
            configurable: true,
        });
    }
}
exports.TemplateParseError = TemplateParseError;
function createTemplateParseError(parseError) {
    const message = parseError.msg;
    const fileName = parseError.span.start.file.url;
    const index = parseError.span.start.offset;
    const lineNumber = parseError.span.start.line + 1;
    const column = parseError.span.start.col + 1;
    return new TemplateParseError(message, fileName, index, lineNumber, column);
}
function parseForESLint(code, options) {
    const angularCompilerResult = (0, bundled_angular_compiler_1.parseTemplate)(code, options.filePath, {
        preserveWhitespaces: true,
        preserveLineEndings: true,
        collectCommentNodes: true,
    });
    let ngAstCommentNodes = [];
    if (Array.isArray(angularCompilerResult.commentNodes)) {
        ngAstCommentNodes = angularCompilerResult.commentNodes;
    }
    const ast = {
        type: 'Program',
        comments: convertNgAstCommentsToTokens(ngAstCommentNodes),
        tokens: [],
        range: [0, 0],
        loc: {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
        },
        templateNodes: angularCompilerResult.nodes,
        value: code,
    };
    const scopeManager = new eslint_scope_1.ScopeManager({});
    new eslint_scope_1.Scope(scopeManager, 'module', null, ast, false);
    preprocessNode(ast, code);
    const startSourceSpan = getStartSourceSpanFromAST(ast);
    const endSourceSpan = getEndSourceSpanFromAST(ast);
    if (startSourceSpan && endSourceSpan) {
        ast.range = [startSourceSpan.start.offset, endSourceSpan.end.offset];
        ast.loc = {
            start: (0, convert_source_span_to_loc_1.convertNodeSourceSpanToLoc)(startSourceSpan).start,
            end: (0, convert_source_span_to_loc_1.convertNodeSourceSpanToLoc)(endSourceSpan).end,
        };
    }
    if (!options.suppressParseErrors && angularCompilerResult.errors?.length) {
        throw createTemplateParseError(angularCompilerResult.errors[0]);
    }
    return {
        ast,
        scopeManager,
        visitorKeys: KEYS,
        services: {
            convertNodeSourceSpanToLoc: convert_source_span_to_loc_1.convertNodeSourceSpanToLoc,
            convertElementSourceSpanToLoc: convert_source_span_to_loc_1.convertElementSourceSpanToLoc,
        },
    };
}
function parse(code, options) {
    return parseForESLint(code, options).ast;
}
// NOTE - we cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
exports.version = require('../package.json').version;
exports.meta = {
    name: 'angular-eslint/template-parser',
    version: exports.version,
};
