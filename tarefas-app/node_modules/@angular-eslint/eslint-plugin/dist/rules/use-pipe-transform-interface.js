"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'use-pipe-transform-interface';
const PIPE_TRANSFORM = 'PipeTransform';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Ensures that \`Pipes\` implement \`${PIPE_TRANSFORM}\` interface`,
            recommended: 'recommended',
        },
        fixable: 'code',
        schema: [],
        messages: {
            usePipeTransformInterface: `Pipes should implement \`${PIPE_TRANSFORM}\` interface`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [`ClassDeclaration:not(:has(TSClassImplements:matches([expression.name='${PIPE_TRANSFORM}'], [expression.property.name='${PIPE_TRANSFORM}']))) > Decorator[expression.callee.name='Pipe']`]({ parent: classDeclaration, }) {
                context.report({
                    node: classDeclaration.id ?? classDeclaration,
                    messageId: 'usePipeTransformInterface',
                    fix: (fixer) => {
                        const { implementsNodeReplace, implementsTextReplace } = utils_1.RuleFixes.getImplementsSchemaFixer(classDeclaration, PIPE_TRANSFORM);
                        return [
                            utils_1.RuleFixes.getImportAddFix({
                                compatibleWithTypeOnlyImport: true,
                                fixer,
                                importName: PIPE_TRANSFORM,
                                moduleName: '@angular/core',
                                node: classDeclaration,
                            }),
                            fixer.insertTextAfter(implementsNodeReplace, implementsTextReplace),
                        ].filter(utils_1.isNotNullOrUndefined);
                    },
                });
            },
        };
    },
});
exports.RULE_DOCS_EXTENSION = {
    rationale: "Implementing the PipeTransform interface provides TypeScript compile-time checking to ensure your pipe has the correct transform() method signature. Without the interface, typos in the method name or incorrect parameters won't be caught until runtime. The interface also serves as self-documentation and enables better IDE support like autocomplete and inline documentation. While Angular requires pipes to have a transform() method, using the PipeTransform interface leverages TypeScript's type system to catch implementation errors during development rather than at runtime.",
};
