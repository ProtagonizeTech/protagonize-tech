"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateParserServices = getTemplateParserServices;
exports.ensureTemplateParser = ensureTemplateParser;
function getTemplateParserServices(context) {
    ensureTemplateParser(context);
    return context.sourceCode.parserServices;
}
/**
 * Utility for rule authors to ensure that their rule is correctly being used with @angular-eslint/template-parser
 * If @angular-eslint/template-parser is not the configured parser when the function is invoked it will throw
 */
function ensureTemplateParser(context) {
    const parserServices = context.sourceCode
        .parserServices;
    if (!parserServices?.convertNodeSourceSpanToLoc ||
        !parserServices?.convertElementSourceSpanToLoc) {
        /**
         * The user needs to have configured "parser" in their eslint config and set it
         * to @angular-eslint/template-parser
         */
        throw new Error("You have used a rule which requires '@angular-eslint/template-parser' to be used as the 'parser' in your ESLint config.");
    }
}
