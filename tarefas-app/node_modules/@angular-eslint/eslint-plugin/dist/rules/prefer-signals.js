"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const signals_1 = require("../utils/signals");
const DEFAULT_OPTIONS = {
    preferReadonlySignalProperties: true,
    preferInputSignals: true,
    preferQuerySignals: true,
    useTypeChecking: false,
    additionalSignalCreationFunctions: [],
};
const KNOWN_SIGNAL_CREATION_FUNCTIONS = new Set([
    'computed',
    'contentChild',
    'contentChildren',
    'input',
    'linkedSignal',
    'model',
    'signal',
    'toSignal',
    'viewChild',
    'viewChildren',
]);
exports.RULE_NAME = 'prefer-signals';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Use readonly signals instead of `@Input()`, `@ViewChild()` and other legacy decorators',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    preferReadonlySignalProperties: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.preferReadonlySignalProperties,
                    },
                    preferInputSignals: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.preferInputSignals,
                    },
                    preferQuerySignals: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.preferQuerySignals,
                    },
                    useTypeChecking: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.useTypeChecking,
                    },
                    additionalSignalCreationFunctions: {
                        type: 'array',
                        items: { type: 'string' },
                        default: DEFAULT_OPTIONS.additionalSignalCreationFunctions,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            preferInputSignals: 'Use `InputSignal`s (e.g. via `input()`) for Component input properties rather than the legacy `@Input()` decorator',
            preferQuerySignals: 'Use the `{{function}}` function instead of the `{{decorator}}` decorator',
            preferReadonlySignalProperties: 'Properties declared using signals should be marked as `readonly` since they should not be reassigned',
        },
    },
    defaultOptions: [{ ...DEFAULT_OPTIONS }],
    create(context, [{ preferReadonlySignalProperties = DEFAULT_OPTIONS.preferReadonlySignalProperties, preferInputSignals = DEFAULT_OPTIONS.preferInputSignals, preferQuerySignals = DEFAULT_OPTIONS.preferQuerySignals, additionalSignalCreationFunctions = DEFAULT_OPTIONS.additionalSignalCreationFunctions, useTypeChecking = DEFAULT_OPTIONS.useTypeChecking, },]) {
        let services;
        const listener = {};
        if (preferReadonlySignalProperties) {
            listener[`PropertyDefinition:not([readonly=true])`] = (node) => {
                let shouldBeReadonly = false;
                if (node.typeAnnotation) {
                    // Use the type annotation to determine
                    // whether the property is a signal.
                    if (node.typeAnnotation.typeAnnotation.type ===
                        utils_2.AST_NODE_TYPES.TSTypeReference) {
                        const type = node.typeAnnotation.typeAnnotation;
                        if (type.typeArguments &&
                            type.typeName.type === utils_2.AST_NODE_TYPES.Identifier &&
                            signals_1.KNOWN_SIGNAL_TYPES.has(type.typeName.name)) {
                            shouldBeReadonly = true;
                        }
                    }
                }
                else {
                    // There is no type annotation, so try to
                    // use the value assigned to the property
                    // to determine whether it would be a signal.
                    let value = node.value;
                    if (value?.type === utils_2.AST_NODE_TYPES.CallExpression) {
                        const callee = value.callee;
                        // A `WritableSignal` can be turned into a `Signal` using
                        // the `.asReadonly()` method. If that method is being
                        // called, then we need to look at the object that the method
                        // is called on to determine if it's being called on a `Signal`.
                        if (callee.type === utils_2.AST_NODE_TYPES.MemberExpression) {
                            if (callee.property.type === utils_2.AST_NODE_TYPES.Identifier &&
                                callee.property.name === 'asReadonly') {
                                value = callee.object;
                            }
                        }
                    }
                    if (value?.type === utils_2.AST_NODE_TYPES.CallExpression) {
                        let callee = value.callee;
                        // Some signal-creating functions have a `.required`
                        // member. For example, `input.required()`.
                        if (callee.type === utils_2.AST_NODE_TYPES.MemberExpression) {
                            if (callee.property.type === utils_2.AST_NODE_TYPES.Identifier &&
                                callee.property.name !== 'required') {
                                return;
                            }
                            callee = callee.object;
                        }
                        if (callee.type === utils_2.AST_NODE_TYPES.Identifier &&
                            (KNOWN_SIGNAL_CREATION_FUNCTIONS.has(callee.name) ||
                                additionalSignalCreationFunctions.includes(callee.name))) {
                            shouldBeReadonly = true;
                        }
                    }
                    if (!shouldBeReadonly && useTypeChecking && node.value) {
                        services ??= utils_2.ESLintUtils.getParserServices(context);
                        const name = services
                            .getTypeAtLocation(node.value)
                            .getSymbol()?.name;
                        shouldBeReadonly =
                            name !== undefined && signals_1.KNOWN_SIGNAL_TYPES.has(name);
                    }
                }
                if (shouldBeReadonly) {
                    context.report({
                        node: node.key,
                        messageId: 'preferReadonlySignalProperties',
                        fix: (fixer) => fixer.insertTextBefore(node.key, 'readonly '),
                    });
                }
            };
        }
        if (preferInputSignals) {
            listener[utils_1.Selectors.INPUT_DECORATOR] = (node) => {
                context.report({
                    node,
                    messageId: 'preferInputSignals',
                });
            };
        }
        if (preferQuerySignals) {
            listener['Decorator[expression.callee.name=/^(ContentChild|ContentChildren|ViewChild|ViewChildren)$/]'] = (node) => {
                if (node.expression.type === utils_2.AST_NODE_TYPES.CallExpression &&
                    node.expression.callee.type === utils_2.AST_NODE_TYPES.Identifier) {
                    const decoratorName = node.expression.callee.name;
                    context.report({
                        node,
                        messageId: 'preferQuerySignals',
                        data: {
                            function: decoratorName.slice(0, 1).toLowerCase() +
                                decoratorName.slice(1),
                            decorator: decoratorName,
                        },
                    });
                }
            };
        }
        return listener;
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Angular signals represent the future of reactivity in Angular, offering fine-grained change detection, better performance, and improved developer experience. Signal-based APIs like input(), viewChild(), and contentChild() provide type-safe, reactive properties that integrate seamlessly with computed values and effects. Unlike decorator-based APIs (@Input(), @ViewChild(), etc.), signals enable more granular tracking of dependencies and updates, allowing Angular to optimize change detection. Signal properties should be marked readonly because signals themselves are stable references - you read their value by calling them, you don't reassign the signal. This prevents bugs where developers might accidentally reassign a signal instead of updating its value. Using signals throughout your components creates a consistent, reactive programming model that makes data flow explicit and easier to understand.",
};
