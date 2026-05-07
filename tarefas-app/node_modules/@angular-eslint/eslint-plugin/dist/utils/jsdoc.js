"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallLikeNode = getCallLikeNode;
exports.getSymbols = getSymbols;
exports.isNodeCalleeOfParent = isNodeCalleeOfParent;
exports.hasJsDocTag = hasJsDocTag;
exports.getCallLikeNodeSymbol = getCallLikeNodeSymbol;
exports.isDeclaration = isDeclaration;
exports.isInsideExportOrImport = isInsideExportOrImport;
const utils_1 = require("@typescript-eslint/utils");
const typescript_1 = __importDefault(require("typescript"));
const tsutils = __importStar(require("ts-api-utils"));
function getCallLikeNode(node) {
    let callee = node;
    while (callee.parent?.type === utils_1.AST_NODE_TYPES.MemberExpression &&
        callee.parent.property === callee) {
        callee = callee.parent;
    }
    return isNodeCalleeOfParent(callee) ? callee : undefined;
}
function getSymbols(node, services, checker) {
    const callLikeNode = getCallLikeNode(node);
    if (callLikeNode) {
        return [getCallLikeNodeSymbol(callLikeNode, services, checker)];
    }
    else if (node.parent.type === utils_1.AST_NODE_TYPES.Property) {
        const property = services
            .getTypeAtLocation(node.parent.parent)
            .getProperty(node.name);
        const propertySymbol = services.getSymbolAtLocation(node);
        const valueSymbol = checker.getShorthandAssignmentValueSymbol(propertySymbol?.valueDeclaration);
        return [
            ...getSymbolsInAliasesChain(propertySymbol, checker),
            property,
            propertySymbol,
            valueSymbol,
        ];
    }
    return getSymbolsInAliasesChain(services.getSymbolAtLocation(node), checker);
}
function isNodeCalleeOfParent(node) {
    switch (node.parent?.type) {
        case utils_1.AST_NODE_TYPES.NewExpression:
        case utils_1.AST_NODE_TYPES.CallExpression:
            return node.parent.callee === node;
        case utils_1.AST_NODE_TYPES.TaggedTemplateExpression:
            return node.parent.tag === node;
        default:
            return false;
    }
}
function hasJsDocTag(symbols, tagName) {
    return symbols.some((symbol) => symbol?.getJsDocTags().some((tag) => tag.name === tagName));
}
function getCallLikeNodeSymbol(node, services, checker) {
    const symbol = services.getSymbolAtLocation(node);
    return symbol !== undefined &&
        tsutils.isSymbolFlagSet(symbol, typescript_1.default.SymbolFlags.Alias)
        ? checker.getAliasedSymbol(symbol)
        : symbol;
}
function isDeclaration(node) {
    const { parent } = node;
    switch (parent.type) {
        case utils_1.AST_NODE_TYPES.ClassDeclaration:
        case utils_1.AST_NODE_TYPES.VariableDeclarator:
        case utils_1.AST_NODE_TYPES.TSEnumMember:
            return parent.id === node;
        case utils_1.AST_NODE_TYPES.MethodDefinition:
        case utils_1.AST_NODE_TYPES.PropertyDefinition:
        case utils_1.AST_NODE_TYPES.AccessorProperty:
            return parent.key === node;
        case utils_1.AST_NODE_TYPES.Property:
            if (parent.shorthand && parent.value === node) {
                return parent.parent.type === utils_1.AST_NODE_TYPES.ObjectPattern;
            }
            if (parent.value === node) {
                return false;
            }
            return parent.parent.type === utils_1.AST_NODE_TYPES.ObjectExpression;
        case utils_1.AST_NODE_TYPES.AssignmentPattern:
            return parent.left === node;
        case utils_1.AST_NODE_TYPES.FunctionDeclaration:
        case utils_1.AST_NODE_TYPES.FunctionExpression:
        case utils_1.AST_NODE_TYPES.TSDeclareFunction:
        case utils_1.AST_NODE_TYPES.TSEmptyBodyFunctionExpression:
        case utils_1.AST_NODE_TYPES.TSEnumDeclaration:
        case utils_1.AST_NODE_TYPES.TSInterfaceDeclaration:
        case utils_1.AST_NODE_TYPES.TSMethodSignature:
        case utils_1.AST_NODE_TYPES.TSModuleDeclaration:
        case utils_1.AST_NODE_TYPES.TSParameterProperty:
        case utils_1.AST_NODE_TYPES.TSPropertySignature:
        case utils_1.AST_NODE_TYPES.TSTypeAliasDeclaration:
        case utils_1.AST_NODE_TYPES.TSTypeParameter:
            return true;
        default:
            return false;
    }
}
function isInsideExportOrImport(node) {
    let current = node;
    while (true) {
        switch (current.type) {
            case utils_1.AST_NODE_TYPES.ExportNamedDeclaration:
            case utils_1.AST_NODE_TYPES.ImportDeclaration:
                return true;
            case utils_1.AST_NODE_TYPES.BlockStatement:
            case utils_1.AST_NODE_TYPES.ClassDeclaration:
            case utils_1.AST_NODE_TYPES.TSInterfaceDeclaration:
            case utils_1.AST_NODE_TYPES.FunctionDeclaration:
            case utils_1.AST_NODE_TYPES.FunctionExpression:
            case utils_1.AST_NODE_TYPES.Program:
            case utils_1.AST_NODE_TYPES.TSUnionType:
            case utils_1.AST_NODE_TYPES.VariableDeclarator:
                return false;
            default:
                current = current.parent;
        }
    }
}
function getSymbolsInAliasesChain(symbol, checker) {
    const symbols = [symbol];
    if (!symbol || !tsutils.isSymbolFlagSet(symbol, typescript_1.default.SymbolFlags.Alias)) {
        return symbols;
    }
    const targetSymbol = checker.getAliasedSymbol(symbol);
    while (tsutils.isSymbolFlagSet(symbol, typescript_1.default.SymbolFlags.Alias)) {
        const immediateAliasedSymbol = symbol.getDeclarations() && checker.getImmediateAliasedSymbol(symbol);
        if (!immediateAliasedSymbol) {
            break;
        }
        symbol = immediateAliasedSymbol;
        if (symbol === targetSymbol) {
            symbols.push(symbol);
        }
    }
    return symbols;
}
