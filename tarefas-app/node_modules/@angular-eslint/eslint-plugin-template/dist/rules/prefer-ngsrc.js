"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'prefer-ngsrc';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures ngSrc is used instead of src for img elements',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            missingAttribute: 'The attribute [ngSrc] should be used for img elements instead of [src].',
            invalidDoubleSource: 'Only [ngSrc] should exist on an img element. Delete the [src] attribute.',
            suggestReplaceWithNgSrc: 'Replace [src] with [ngSrc]',
            suggestRemoveSrc: 'Remove the [src] attribute',
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        const sourceCode = context.sourceCode;
        function reportMissingNgSrc(srcAttribute) {
            const loc = parserServices.convertNodeSourceSpanToLoc(srcAttribute.sourceSpan);
            context.report({
                loc,
                messageId: 'missingAttribute',
                suggest: [
                    {
                        messageId: 'suggestReplaceWithNgSrc',
                        fix: (fixer) => {
                            const originalAttribute = sourceCode
                                .getText()
                                .slice(srcAttribute.sourceSpan.start.offset, srcAttribute.sourceSpan.end.offset);
                            let updatedAttribute;
                            if (originalAttribute.startsWith('[attr.src]')) {
                                updatedAttribute = originalAttribute.replace(/^\[attr\.src]/, '[ngSrc]');
                            }
                            else if (originalAttribute.startsWith('[src]')) {
                                updatedAttribute = originalAttribute.replace(/^\[src]/, '[ngSrc]');
                            }
                            else {
                                updatedAttribute = originalAttribute.replace(/^src/, 'ngSrc');
                            }
                            return fixer.replaceTextRange([
                                srcAttribute.sourceSpan.start.offset,
                                srcAttribute.sourceSpan.end.offset,
                            ], updatedAttribute);
                        },
                    },
                ],
            });
        }
        function reportDoubleSrc(srcAttribute) {
            const loc = parserServices.convertNodeSourceSpanToLoc(srcAttribute.sourceSpan);
            context.report({
                loc,
                messageId: 'invalidDoubleSource',
                suggest: [
                    {
                        messageId: 'suggestRemoveSrc',
                        fix: (fixer) => {
                            const fullText = sourceCode.getText();
                            let startOffset = srcAttribute.sourceSpan.start.offset;
                            // Move back to include preceding whitespace
                            while (startOffset > 0 && /\s/.test(fullText[startOffset - 1])) {
                                startOffset--;
                            }
                            return fixer.removeRange([
                                startOffset,
                                srcAttribute.sourceSpan.end.offset,
                            ]);
                        },
                    },
                ],
            });
        }
        return {
            'Element[name=/^img$/i]'(element) {
                const ngSrcAttribute = getNgSrcAttribute(element);
                const srcAttribute = getNormalSrcAttribute(element);
                if (!srcAttribute ||
                    (!ngSrcAttribute && isSrcBase64Image(srcAttribute))) {
                    return;
                }
                if (!ngSrcAttribute) {
                    reportMissingNgSrc(srcAttribute);
                }
                else {
                    reportDoubleSrc(srcAttribute);
                }
            },
        };
    },
});
function getNgSrcAttribute({ inputs, attributes, }) {
    return [...inputs, ...attributes].find(({ name }) => name === 'ngSrc');
}
function getNormalSrcAttribute({ inputs, attributes, }) {
    return [...inputs, ...attributes].find(({ name }) => name === 'src');
}
// Adheres to angular's assertion that ngSrc value is not a data URL.
// https://github.com/angular/angular/blob/17.0.3/packages/common/src/directives/ng_optimized_image/ng_optimized_image.ts#L585
function isSrcBase64Image(attribute) {
    const isPlainDataAttribute = attribute instanceof bundled_angular_compiler_1.TmplAstTextAttribute &&
        attribute.value.trim().startsWith('data:');
    if (isPlainDataAttribute) {
        return true;
    }
    const isBoundDataAttribute = attribute.value instanceof bundled_angular_compiler_1.ASTWithSource &&
        isDataStringPrimitive(attribute.value.ast);
    if (isBoundDataAttribute) {
        return true;
    }
    const isBoundDataInExpression = attribute.value instanceof bundled_angular_compiler_1.ASTWithSource &&
        attribute.value.ast instanceof bundled_angular_compiler_1.Binary &&
        attribute.value.ast.operation === '+' &&
        isDataStringPrimitive(attribute.value.ast.left);
    return isBoundDataInExpression;
}
function isDataStringPrimitive(primitive) {
    return (primitive instanceof bundled_angular_compiler_1.LiteralPrimitive &&
        typeof primitive.value === 'string' &&
        primitive.value.trim().startsWith('data:'));
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "The ngSrc directive (part of Angular's Image directive introduced in v15) provides significant performance and user experience benefits over the standard src attribute for images. Using ngSrc enables automatic lazy loading, responsive images with srcset generation, optimized loading priority hints, prevention of layout shift by enforcing width and height attributes, and automatic image optimization when using an image loader. These features dramatically improve Largest Contentful Paint (LCP) and other Core Web Vitals metrics. The directive also provides warnings for common mistakes like missing width/height. The rule allows data: URIs with src since those are inline base64 images that don't benefit from ngSrc optimizations. For best performance and user experience, all external images should use ngSrc.",
};
