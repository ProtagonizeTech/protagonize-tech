"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'prefer-output-readonly';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer to declare `@Output`, `OutputEmitterRef` and `OutputRef` as `readonly` since they are not supposed to be reassigned',
        },
        hasSuggestions: true,
        schema: [],
        messages: {
            preferOutputReadonly: 'Prefer to declare `{{type}}` as `readonly` since they are not supposed to be reassigned',
            suggestAddReadonlyModifier: 'Add `readonly` modifier',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [`PropertyDefinition:not([readonly=true]) > ${utils_1.Selectors.OUTPUT_DECORATOR}`]({ parent: { key }, }) {
                report(key, '@Output');
            },
            [`PropertyDefinition:not([readonly=true]):matches([typeAnnotation.typeAnnotation.typeName.name=OutputEmitterRef], [value.callee.name=output])`]({ key, }) {
                report(key, 'OutputEmitterRef');
            },
            [`PropertyDefinition:not([readonly=true]):matches([typeAnnotation.typeAnnotation.typeName.name=OutputRef], [value.callee.name=outputFromObservable])`]({ key, }) {
                report(key, 'OutputRef');
            },
        };
        function report(key, type) {
            context.report({
                node: key,
                messageId: 'preferOutputReadonly',
                data: { type },
                suggest: [
                    {
                        messageId: 'suggestAddReadonlyModifier',
                        fix: (fixer) => fixer.insertTextBefore(key, 'readonly '),
                    },
                ],
            });
        }
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Output properties should never be reassigned after initialization because they are meant to be stable references that parent components can bind to. Reassigning an output would break those bindings. For @Output() with EventEmitter, marking the property as 'readonly' makes this constraint explicit and leverages TypeScript's type system to prevent accidental reassignment. The correct pattern is '@Output() readonly userClick = new EventEmitter<User>()', not '@Output() userClick: EventEmitter<User>' where the emitter could be reassigned later. Note that the modern output() function (introduced in Angular v17.3) returns an OutputEmitterRef which is inherently immutable, so this rule is less relevant for those outputs but remains important for traditional EventEmitter-based outputs.",
};
