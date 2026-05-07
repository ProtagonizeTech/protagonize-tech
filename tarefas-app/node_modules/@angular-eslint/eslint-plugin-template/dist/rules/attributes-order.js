"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = exports.OrderType = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
var OrderType;
(function (OrderType) {
    OrderType["TemplateReferenceVariable"] = "TEMPLATE_REFERENCE";
    OrderType["StructuralDirective"] = "STRUCTURAL_DIRECTIVE";
    OrderType["AttributeBinding"] = "ATTRIBUTE_BINDING";
    OrderType["InputBinding"] = "INPUT_BINDING";
    OrderType["OutputBinding"] = "OUTPUT_BINDING";
    OrderType["TwoWayBinding"] = "TWO_WAY_BINDING";
})(OrderType || (exports.OrderType = OrderType = {}));
exports.RULE_NAME = 'attributes-order';
const DEFAULT_ORDER = [
    OrderType.StructuralDirective,
    OrderType.TemplateReferenceVariable,
    OrderType.AttributeBinding,
    OrderType.InputBinding,
    OrderType.TwoWayBinding,
    OrderType.OutputBinding,
];
const DEFAULT_OPTIONS = {
    alphabetical: false,
    order: [...DEFAULT_ORDER],
};
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'layout',
        docs: {
            description: 'Ensures that HTML attributes and Angular bindings are sorted based on an expected order',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    alphabetical: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.alphabetical,
                    },
                    order: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: DEFAULT_OPTIONS.order,
                        },
                        default: DEFAULT_OPTIONS.order,
                        minItems: DEFAULT_OPTIONS.order.length,
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            attributesOrder: `The element's attributes/bindings did not match the expected order: expected {{expected}} instead of {{actual}}`,
        },
    },
    defaultOptions: [DEFAULT_OPTIONS],
    create(context, [{ alphabetical, order }]) {
        const parserServices = (0, utils_1.getTemplateParserServices)(context);
        function getLocation(attr) {
            return adjustLocation(parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan), 'location', attr);
        }
        return {
            ['Element, Template'](node) {
                if (isImplicitTemplate(node)) {
                    return;
                }
                const allAttributes = getAllAttributes(node, context.filename, context.sourceCode);
                if (allAttributes.length < 2) {
                    return;
                }
                const sortedAttributes = [...allAttributes].sort(byLocation);
                const expectedAttributes = [...allAttributes].sort(byOrder(order, alphabetical));
                let errorRange;
                for (let i = 0; i < sortedAttributes.length; i++) {
                    if (sortedAttributes[i] !== expectedAttributes[i]) {
                        errorRange = [errorRange?.[0] ?? i, i];
                    }
                }
                if (errorRange) {
                    const [startIndex, endIndex] = errorRange;
                    const sourceCode = context.sourceCode;
                    const { start } = getLocation(sortedAttributes[startIndex]);
                    const { end } = getLocation(sortedAttributes[endIndex]);
                    const loc = { start, end };
                    const range = [
                        getStartPos(sortedAttributes[startIndex]),
                        getEndPos(sortedAttributes[endIndex]),
                    ];
                    let replacementText = '';
                    let lastPos = range[0];
                    for (let i = startIndex; i <= endIndex; i++) {
                        const oldAttr = sortedAttributes[i];
                        const oldStart = getStartPos(oldAttr);
                        const oldEnd = getEndPos(oldAttr);
                        const newAttr = expectedAttributes[i];
                        const newStart = getStartPos(newAttr);
                        const newEnd = getEndPos(newAttr);
                        replacementText += sourceCode.text.slice(lastPos, oldStart);
                        replacementText += sourceCode.text.slice(newStart, newEnd);
                        lastPos = oldEnd;
                    }
                    context.report({
                        loc,
                        messageId: 'attributesOrder',
                        data: {
                            expected: expectedAttributes
                                .slice(startIndex, endIndex + 1)
                                .map((a) => `\`${getMessageName(a)}\``)
                                .join(', '),
                            actual: sortedAttributes
                                .slice(startIndex, endIndex + 1)
                                .map((a) => `\`${getMessageName(a)}\``)
                                .join(', '),
                        },
                        fix: (fixer) => fixer.replaceTextRange(range, replacementText),
                    });
                }
            },
        };
    },
});
function byLocation(one, other) {
    return one.sourceSpan.start.line === other.sourceSpan.start.line
        ? one.sourceSpan.start.col - other.sourceSpan.start.col
        : one.sourceSpan.start.line - other.sourceSpan.start.line;
}
function byOrder(order, alphabetical) {
    return function (one, other) {
        const orderComparison = getOrderIndex(one, order) - getOrderIndex(other, order);
        if (alphabetical && orderComparison === 0) {
            const oneName = one.keySpan?.details ?? one.name;
            const oneNormalised = oneName.replace(/^i18n-/, '');
            const otherName = other.keySpan?.details ?? other.name;
            const otherNormalised = otherName.replace(/^i18n-/, '');
            if (oneNormalised === otherNormalised) {
                return /^i18n-/.test(oneName) ? 1 : -1;
            }
            return oneNormalised > otherNormalised ? 1 : -1;
        }
        return orderComparison;
    };
}
function getOrderIndex(attr, order) {
    return order.indexOf(attr.orderType);
}
function getAllAttributes(node, filename, sourceCode) {
    // If there are any i18n attributes (either associated with the
    // element itself, or with any attribute or input), then we need
    // to use the HTML parser to get the attributes because the i18n
    // metadata does not contain the spans of the i18n attributes.
    if (node.i18n) {
        return getAttributesFromHtmlParser(node, filename, node.inputs);
    }
    const { attributes, inputs, outputs, references } = node;
    const extendedInputs = [];
    const attributeBindings = [];
    for (const input of inputs) {
        if (input.i18n) {
            return getAttributesFromHtmlParser(node, filename, node.inputs);
        }
        // Some attributes are parsed as inputs by the Angular template parser,
        // but they don't have square brackets. We don't want those attributes
        // to be classified as inputs because they look like regular attributes.
        // The name of the input will never include the square brackets, so we
        // need to look at the source. Unfortunately, the key span also doesn't
        // include the square brackets, so the source span is what we need to use.
        if (sourceCode.text.at(input.sourceSpan.start.offset) === '[') {
            extendedInputs.push(toInputBindingOrderType(input));
        }
        else {
            attributeBindings.push(toAttributeBindingOrderType(input));
        }
    }
    for (const attribute of attributes) {
        if (attribute.i18n) {
            return getAttributesFromHtmlParser(node, filename, node.inputs);
        }
        attributeBindings.push(toAttributeBindingOrderType(attribute));
    }
    const { extractedBananaBoxes, extractedInputs, extractedOutputs } = normalizeInputsOutputs(extendedInputs, outputs.map(toOutputBindingOrderType));
    return [
        ...extractTemplateAttrs(node),
        ...attributeBindings,
        ...references.map(toTemplateReferenceVariableOrderType),
        ...extractedBananaBoxes,
        ...extractedInputs,
        ...extractedOutputs,
    ];
}
function toAttributeBindingOrderType(attribute) {
    return {
        ...attribute,
        orderType: OrderType.AttributeBinding,
    };
}
function toInputBindingOrderType(input) {
    return {
        ...input,
        orderType: OrderType.InputBinding,
    };
}
function toStructuralDirectiveOrderType(attributeOrInput) {
    return {
        ...attributeOrInput,
        orderType: OrderType.StructuralDirective,
    };
}
function toOutputBindingOrderType(output) {
    return {
        ...output,
        orderType: OrderType.OutputBinding,
    };
}
function toTwoWayBindingOrderType(output) {
    return {
        ...output,
        orderType: OrderType.TwoWayBinding,
    };
}
function toTemplateReferenceVariableOrderType(reference) {
    return {
        ...reference,
        orderType: OrderType.TemplateReferenceVariable,
    };
}
function isImplicitTemplate(node) {
    return (isTmplAstTemplate(node) &&
        (node.tagName === null ||
            !/^(:svg:)?ng-template$/.test(node.tagName.toLowerCase())));
}
function extractTemplateAttrs(node) {
    if (isTmplAstTemplate(node)) {
        return node.templateAttrs.map(toStructuralDirectiveOrderType).concat(node.variables.map((x) => {
            return {
                ...toAttributeBindingOrderType(x),
                // `let-` is excluded from the keySpan and name - add it back in
                keySpan: new bundled_angular_compiler_1.ParseSourceSpan(x.keySpan.start.moveBy(-4), x.keySpan.end),
                name: 'let-' + x.name,
            };
        }));
    }
    if (!isImplicitTemplate(node.parent)) {
        return [];
    }
    /*
     * There may be multiple "attributes" for a structural directive even though
     * there is only a single HTML attribute:
     * e.g. `<ng-container *ngFor="let foo of bar"></ng-container>`
     * will be parsed as two attributes (`ngFor` and `ngForOf`)
     */
    const attrs = node.parent.templateAttrs.map(toStructuralDirectiveOrderType);
    let keyEnd = attrs[0].keySpan?.end;
    if (keyEnd?.getContext(0, 0)?.after === '=') {
        keyEnd = keyEnd.moveBy(1);
        const apos = keyEnd.getContext(0, 0)?.after;
        if (apos === "'" || apos === '"') {
            do {
                keyEnd = keyEnd.moveBy(1);
            } while (keyEnd.getContext(0, 0)?.after !== apos);
        }
        else {
            while (!/[\s>]/.test(keyEnd.getContext(0, 0)?.after ?? '')) {
                keyEnd = keyEnd.moveBy(1);
            }
        }
        return [
            {
                ...attrs[0],
                sourceSpan: new bundled_angular_compiler_1.ParseSourceSpan(attrs[0].sourceSpan.start, keyEnd),
            },
        ];
    }
    return [attrs[0]];
}
function normalizeInputsOutputs(inputs, outputs) {
    const extractedInputs = inputs
        .filter((input) => !outputs.some((output) => isOnSameLocation(input, output)))
        .map(toInputBindingOrderType);
    const { extractedBananaBoxes, extractedOutputs } = outputs.reduce(({ extractedBananaBoxes, extractedOutputs }, output) => {
        const boundInput = inputs.find((input) => isOnSameLocation(input, output));
        return {
            extractedBananaBoxes: extractedBananaBoxes.concat(boundInput ? toTwoWayBindingOrderType(boundInput) : []),
            extractedOutputs: extractedOutputs.concat(boundInput ? [] : toOutputBindingOrderType(output)),
        };
    }, { extractedBananaBoxes: [], extractedOutputs: [] });
    return { extractedBananaBoxes, extractedInputs, extractedOutputs };
}
function isTmplAstTemplate(node) {
    return node instanceof bundled_angular_compiler_1.TmplAstTemplate;
}
function isOnSameLocation(input, output) {
    return (input.sourceSpan.start === output.sourceSpan.start &&
        input.sourceSpan.end === output.sourceSpan.end);
}
function getMessageName(expected) {
    const fullName = expected.keySpan?.details ?? expected.name;
    switch (expected.orderType) {
        case OrderType.StructuralDirective:
            return `*${fullName}`;
        case OrderType.TemplateReferenceVariable:
            return `#${fullName}`;
        case OrderType.InputBinding:
            return expected.isI18nForAttribute ? fullName : `[${fullName}]`;
        case OrderType.OutputBinding:
            return `(${fullName})`;
        case OrderType.TwoWayBinding:
            return `[(${fullName})]`;
        default:
            return fullName;
    }
}
function isValuelessStructuralDirective(attr) {
    if (attr.orderType !== OrderType.StructuralDirective || !attr.keySpan) {
        return false;
    }
    const attrSpan = attr.sourceSpan;
    const keySpan = attr.keySpan;
    /**
     * A valueless structural directive will have the same span as its key.
     * TextAttribute[value=''] is not always a reliable selector, because
     * a *structuralDirective with `let var = something` will have value = ''
     */
    return (attrSpan.start.offset === keySpan.start.offset &&
        attrSpan.start.line === keySpan.start.line &&
        attrSpan.start.col === keySpan.start.col &&
        attrSpan.end.offset === keySpan.end.offset &&
        attrSpan.end.line === keySpan.end.line &&
        attrSpan.end.col === keySpan.end.col);
}
function getStartPos(expected) {
    return adjustLocation(expected.sourceSpan.start.offset, 'start', expected);
}
function getEndPos(expected) {
    return adjustLocation(expected.sourceSpan.end.offset, 'end', expected);
}
function adjustLocation(locOrOffset, kind, attr) {
    // Spans for structural directives created from the
    // template parser will exclude the leading "*", so
    // we need to move the start back to include it.
    if (!attr.fromHtmlParser &&
        attr.orderType === OrderType.StructuralDirective) {
        if (typeof locOrOffset === 'number') {
            if (kind === 'start') {
                return locOrOffset - 1;
            }
            else {
                return locOrOffset + (isValuelessStructuralDirective(attr) ? 0 : 1);
            }
        }
        else {
            return {
                start: {
                    line: locOrOffset.start.line,
                    column: locOrOffset.start.column - 1,
                },
                end: {
                    line: locOrOffset.end.line,
                    column: locOrOffset.end.column +
                        (isValuelessStructuralDirective(attr) ? 0 : 1),
                },
            };
        }
    }
    return locOrOffset;
}
function getAttributesFromHtmlParser(node, filename, inputs) {
    // The template AST does not include the spans for i18n attributes.
    // To get their spans, we can re-parse just the element as HTML.
    // We only need the spans of the attributes, so take only the
    // start element and the end element (if there is one) so that
    // we don't waste time parsing the element's content.
    let html = node.startSourceSpan.toString();
    if (node.endSourceSpan) {
        html += node.endSourceSpan.toString();
    }
    const parser = new bundled_angular_compiler_1.HtmlParser();
    const tree = parser.parse(html, filename, { preserveLineEndings: true });
    const element = tree.rootNodes.find((n) => n instanceof bundled_angular_compiler_1.Element);
    if (element) {
        return element.attrs.map((attribute) => ({
            ...getHtmlAttributeNameAndOrderType(attribute, inputs),
            fromHtmlParser: true,
            // The HTML element was at the start of the string which means the
            // offset of each element will be relative to the start of the element.
            // To get the offset of the attribute in the template, we need to
            // move each span forward by the offset of the span in the template.
            sourceSpan: new bundled_angular_compiler_1.ParseSourceSpan(node.startSourceSpan.start.moveBy(attribute.sourceSpan.start.offset), node.startSourceSpan.start.moveBy(attribute.sourceSpan.end.offset)),
            keySpan: attribute.keySpan
                ? new bundled_angular_compiler_1.ParseSourceSpan(node.startSourceSpan.start.moveBy(attribute.keySpan.start.offset), node.startSourceSpan.start.moveBy(attribute.keySpan.end.offset))
                : undefined,
        }));
    }
    return [];
}
function getHtmlAttributeNameAndOrderType(attr, inputs) {
    if (attr.name.startsWith('#')) {
        return {
            name: attr.name.slice(1),
            orderType: OrderType.TemplateReferenceVariable,
        };
    }
    if (attr.name.startsWith('*')) {
        return {
            name: attr.name.slice(1),
            orderType: OrderType.StructuralDirective,
        };
    }
    if (attr.name.startsWith('[(') && attr.name.endsWith(')]')) {
        return {
            name: attr.name.slice(2, -2),
            orderType: OrderType.TwoWayBinding,
        };
    }
    if (attr.name.startsWith('[') && attr.name.endsWith(']')) {
        return {
            name: attr.name.slice(1, -1),
            orderType: OrderType.InputBinding,
        };
    }
    if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
        return {
            name: attr.name.slice(1, -1),
            orderType: OrderType.OutputBinding,
        };
    }
    const isI18nForAttribute = attr.name.startsWith('i18n-');
    let orderType = OrderType.AttributeBinding;
    // If the attribute is an i18n attribute, and it is associated with
    // an input binding, then treat it as an input binding for ordering,
    // even though it is a regular attribute. This will keep the i18n
    // attribute immediately after its corresponding input binding.
    if (inputs.length > 0 && isI18nForAttribute) {
        const correspondingName = attr.name.slice(5);
        if (inputs.some((input) => input.name === correspondingName)) {
            orderType = OrderType.InputBinding;
        }
    }
    return {
        name: attr.name,
        orderType,
        isI18nForAttribute,
    };
}
exports.RULE_DOCS_EXTENSION = {
    rationale: 'Consistent ordering of template attributes makes templates easier to read and scan visually. When attributes are always ordered the same way across a codebase (for example: structural directives first, then template references, then inputs, then outputs), developers can quickly locate specific attributes without having to scan randomly-ordered attribute lists. This is especially valuable for elements with many attributes. The rule supports both semantic ordering (grouping by attribute type) and alphabetical sorting within groups, allowing teams to choose the organizational pattern that works best for them.',
};
