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
exports.processInlineTemplates = exports.tsPlugin = exports.templatePlugin = exports.templateParser = exports.configs = void 0;
const eslint_plugin_1 = __importDefault(require("@angular-eslint/eslint-plugin"));
const eslint_plugin_template_1 = __importDefault(require("@angular-eslint/eslint-plugin-template"));
const templateParserBase = __importStar(require("@angular-eslint/template-parser"));
const typescript_eslint_1 = require("typescript-eslint");
const template_accessibility_1 = __importDefault(require("./configs/template-accessibility"));
const template_all_1 = __importDefault(require("./configs/template-all"));
const template_recommended_1 = __importDefault(require("./configs/template-recommended"));
const ts_all_1 = __importDefault(require("./configs/ts-all"));
const ts_recommended_1 = __importDefault(require("./configs/ts-recommended"));
const templateParser = {
    meta: templateParserBase.meta,
    parseForESLint: templateParserBase.parseForESLint,
};
exports.templateParser = templateParser;
const tsPlugin = eslint_plugin_1.default;
exports.tsPlugin = tsPlugin;
const templatePlugin = eslint_plugin_template_1.default;
exports.templatePlugin = templatePlugin;
const configs = {
    tsAll: (0, ts_all_1.default)(tsPlugin, typescript_eslint_1.parser),
    tsRecommended: (0, ts_recommended_1.default)(tsPlugin, typescript_eslint_1.parser),
    templateAll: (0, template_all_1.default)(templatePlugin, templateParser),
    templateRecommended: (0, template_recommended_1.default)(templatePlugin, templateParser),
    templateAccessibility: (0, template_accessibility_1.default)(templatePlugin, templateParser),
};
exports.configs = configs;
// Export more succinct alias for us in user flat config files
const processInlineTemplates = templatePlugin.processors?.['extract-inline-html'];
exports.processInlineTemplates = processInlineTemplates;
/*
// eslint-disable-next-line import/no-default-export --
we do both a default and named exports to allow people to use this package from
both CJS and ESM in very natural ways.
*/
exports.default = {
    configs,
    tsPlugin,
    templateParser,
    templatePlugin,
    processInlineTemplates,
};
