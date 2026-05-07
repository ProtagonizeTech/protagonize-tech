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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateParserServices = exports.ensureTemplateParser = exports.SelectorUtils = exports.Selectors = exports.RuleFixes = exports.CommentUtils = exports.ASTUtils = exports.getNativeEventNames = exports.getAriaAttributeKeys = exports.capitalize = exports.withoutBracketsAndWhitespaces = exports.kebabToCamelCase = exports.toPattern = exports.isNotNullOrUndefined = exports.arrayify = exports.toHumanReadableText = void 0;
var utils_1 = require("./utils");
Object.defineProperty(exports, "toHumanReadableText", { enumerable: true, get: function () { return utils_1.toHumanReadableText; } });
Object.defineProperty(exports, "arrayify", { enumerable: true, get: function () { return utils_1.arrayify; } });
Object.defineProperty(exports, "isNotNullOrUndefined", { enumerable: true, get: function () { return utils_1.isNotNullOrUndefined; } });
Object.defineProperty(exports, "toPattern", { enumerable: true, get: function () { return utils_1.toPattern; } });
Object.defineProperty(exports, "kebabToCamelCase", { enumerable: true, get: function () { return utils_1.kebabToCamelCase; } });
Object.defineProperty(exports, "withoutBracketsAndWhitespaces", { enumerable: true, get: function () { return utils_1.withoutBracketsAndWhitespaces; } });
Object.defineProperty(exports, "capitalize", { enumerable: true, get: function () { return utils_1.capitalize; } });
var get_aria_attribute_keys_1 = require("./eslint-plugin/get-aria-attribute-keys");
Object.defineProperty(exports, "getAriaAttributeKeys", { enumerable: true, get: function () { return get_aria_attribute_keys_1.getAriaAttributeKeys; } });
var get_native_event_names_1 = require("./eslint-plugin/get-native-event-names");
Object.defineProperty(exports, "getNativeEventNames", { enumerable: true, get: function () { return get_native_event_names_1.getNativeEventNames; } });
exports.ASTUtils = __importStar(require("./eslint-plugin/ast-utils"));
exports.CommentUtils = __importStar(require("./eslint-plugin/comment-utils"));
exports.RuleFixes = __importStar(require("./eslint-plugin/rule-fixes"));
exports.Selectors = __importStar(require("./eslint-plugin/selectors"));
exports.SelectorUtils = __importStar(require("./eslint-plugin/selector-utils"));
var parser_services_1 = require("./eslint-plugin-template/parser-services");
Object.defineProperty(exports, "ensureTemplateParser", { enumerable: true, get: function () { return parser_services_1.ensureTemplateParser; } });
Object.defineProperty(exports, "getTemplateParserServices", { enumerable: true, get: function () { return parser_services_1.getTemplateParserServices; } });
