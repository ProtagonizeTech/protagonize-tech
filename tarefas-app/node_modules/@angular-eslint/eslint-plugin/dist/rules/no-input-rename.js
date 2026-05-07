"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const utils_2 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'no-input-rename';
const STYLE_GUIDE_LINK = 'https://angular.dev/guide/components/inputs#choosing-input-names';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that input bindings are not aliased',
            recommended: 'recommended',
        },
        fixable: 'code',
        hasSuggestions: true,
        schema: [
            {
                type: 'object',
                properties: {
                    allowedNames: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'A list with allowed input names',
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            noInputRename: `Input bindings should not be aliased (${STYLE_GUIDE_LINK})`,
            suggestRemoveAliasName: 'Remove alias name',
            suggestReplaceOriginalNameWithAliasName: 'Remove alias name and use it as the original name',
        },
    },
    defaultOptions: [{ allowedNames: [] }],
    create(context, [{ allowedNames = [] }]) {
        let selectors = new Set();
        const ariaAttributeKeys = (0, utils_1.getAriaAttributeKeys)();
        let selectorDirectiveName;
        return {
            [utils_1.Selectors.COMPONENT_OR_DIRECTIVE_SELECTOR_LITERAL](node) {
                const nodeRawText = utils_1.ASTUtils.getRawText(node);
                const bracketMatchResults = nodeRawText.match(/\[(.*?)\]/);
                if (bracketMatchResults) {
                    selectorDirectiveName = bracketMatchResults[1];
                }
                selectors = new Set((0, utils_1.withoutBracketsAndWhitespaces)(nodeRawText).split(','));
            },
            [utils_1.Selectors.INPUT_ALIAS](node) {
                const propertyOrMethodDefinition = utils_1.ASTUtils.getNearestNodeFrom(node, utils_1.ASTUtils.isPropertyOrMethodDefinition);
                if (!propertyOrMethodDefinition ||
                    !utils_2.ASTUtils.isIdentifier(propertyOrMethodDefinition.key)) {
                    return;
                }
                const aliasName = utils_1.ASTUtils.getRawText(node);
                const propertyName = utils_1.ASTUtils.getRawText(propertyOrMethodDefinition.key);
                if (allowedNames.includes(aliasName) ||
                    (ariaAttributeKeys.has(aliasName) &&
                        propertyName === (0, utils_1.kebabToCamelCase)(aliasName))) {
                    return;
                }
                // The alias is either a string in the `@Input()` decorator function,
                // or a string on an `alias` property that is in an object expression
                // that is in the `@Input()` decorator or the `input()` function or the
                // `input.required()` function. If it's on the `alias` property, then we
                // want to remove that whole property rather than just the string literal.
                const stringToRemove = utils_1.ASTUtils.isTemplateElement(node)
                    ? node.parent
                    : node;
                let rangeToRemove = stringToRemove.range;
                if (utils_1.ASTUtils.isProperty(stringToRemove.parent)) {
                    const property = stringToRemove.parent;
                    rangeToRemove = property.range;
                    if (utils_1.ASTUtils.isObjectExpression(property.parent)) {
                        const objectExpression = property.parent;
                        if (objectExpression.properties.length === 1) {
                            // The property is the only property in the
                            // object, so we can remove the whole object.
                            rangeToRemove = objectExpression.range;
                            // If the object is in an `input()` function, then
                            // the object will be the second argument. The first
                            // argument will be the default value. We need to
                            // remove the comma after the default value.
                            const tokenBefore = context.sourceCode.getTokenBefore(objectExpression);
                            if (tokenBefore && utils_2.ASTUtils.isCommaToken(tokenBefore)) {
                                rangeToRemove = [tokenBefore.range[0], rangeToRemove[1]];
                            }
                        }
                        else {
                            // There are other properties in the object, so we
                            // can only remove the property. How we remove it
                            // will depend on where the property is in the object.
                            const propertyIndex = objectExpression.properties.indexOf(property);
                            if (propertyIndex < objectExpression.properties.length - 1) {
                                // The property is not the last one, so we can
                                // remove everything up to the next property
                                // which will remove the comma after it.
                                rangeToRemove = [
                                    property.range[0],
                                    objectExpression.properties[propertyIndex + 1].range[0],
                                ];
                            }
                            else {
                                // The property is the last one. If the object has a
                                // trailing comma, then we want to keep the trailing comma.
                                // The simplest way to do that is to remove the property
                                // and the comma that precedes it.
                                const tokenBefore = context.sourceCode.getTokenBefore(property);
                                if (tokenBefore && utils_2.ASTUtils.isCommaToken(tokenBefore)) {
                                    rangeToRemove = [tokenBefore.range[0], rangeToRemove[1]];
                                }
                            }
                        }
                    }
                }
                if (aliasName === propertyName) {
                    context.report({
                        node,
                        messageId: 'noInputRename',
                        fix: (fixer) => fixer.removeRange(rangeToRemove),
                    });
                }
                else if (!isAliasNameAllowed(selectors, propertyName, aliasName, selectorDirectiveName)) {
                    context.report({
                        node,
                        messageId: 'noInputRename',
                        suggest: [
                            {
                                messageId: 'suggestRemoveAliasName',
                                fix: (fixer) => fixer.removeRange(rangeToRemove),
                            },
                            {
                                messageId: 'suggestReplaceOriginalNameWithAliasName',
                                fix: (fixer) => [
                                    fixer.removeRange(rangeToRemove),
                                    fixer.replaceText(propertyOrMethodDefinition.key, aliasName.includes('-') ? `'${aliasName}'` : aliasName),
                                ],
                            },
                        ],
                    });
                }
            },
            [utils_1.Selectors.INPUTS_METADATA_PROPERTY_LITERAL](node) {
                const ancestorMaybeHostDirectiveAPI = node.parent?.parent?.parent?.parent?.parent;
                if (ancestorMaybeHostDirectiveAPI &&
                    utils_1.ASTUtils.isProperty(ancestorMaybeHostDirectiveAPI)) {
                    /**
                     * Angular v15 introduced the directive composition API: https://angular.dev/guide/directives/directive-composition-api
                     * Renaming host directive inputs using this API is not a bad practice and should not be reported
                     */
                    const hostDirectiveAPIPropertyName = 'hostDirectives';
                    if ((utils_1.ASTUtils.isLiteral(ancestorMaybeHostDirectiveAPI.key) &&
                        ancestorMaybeHostDirectiveAPI.key.value ===
                            hostDirectiveAPIPropertyName) ||
                        (utils_2.ASTUtils.isIdentifier(ancestorMaybeHostDirectiveAPI.key) &&
                            ancestorMaybeHostDirectiveAPI.key.name ===
                                hostDirectiveAPIPropertyName)) {
                        return;
                    }
                }
                const [propertyName, aliasName] = (0, utils_1.withoutBracketsAndWhitespaces)(utils_1.ASTUtils.getRawText(node)).split(':');
                if (!aliasName ||
                    allowedNames.includes(aliasName) ||
                    (ariaAttributeKeys.has(aliasName) &&
                        propertyName === (0, utils_1.kebabToCamelCase)(aliasName))) {
                    return;
                }
                if (aliasName === propertyName) {
                    context.report({
                        node,
                        messageId: 'noInputRename',
                        fix: (fixer) => fixer.replaceText(node, utils_1.ASTUtils.getReplacementText(node, propertyName)),
                    });
                }
                else if (!isAliasNameAllowed(selectors, propertyName, aliasName, selectorDirectiveName)) {
                    context.report({
                        node,
                        messageId: 'noInputRename',
                        suggest: [
                            ['suggestRemoveAliasName', propertyName],
                            ['suggestReplaceOriginalNameWithAliasName', aliasName],
                        ].map(([messageId, name]) => ({
                            messageId,
                            fix: (fixer) => fixer.replaceText(node, utils_1.ASTUtils.getReplacementText(node, name)),
                        })),
                    });
                }
            },
            'ClassDeclaration:exit'() {
                selectors = new Set();
            },
        };
    },
});
function composedName(selector, propertyName) {
    return `${selector}${(0, utils_1.capitalize)(propertyName)}`;
}
function isAliasNameAllowed(selectors, propertyName, aliasName, selectorDirectiveName) {
    return [...selectors].some((selector) => {
        return (selector === aliasName ||
            selectorDirectiveName === aliasName ||
            composedName(selector, propertyName) === aliasName);
    });
}
exports.RULE_DOCS_EXTENSION = {
    rationale: "Renaming inputs creates a confusing situation where the property has one name inside the component class (private name) and a different name in templates (public name). For example, with the @Input() decorator: '@Input(\"userName\") name: string' means you access 'this.name' in the component but bind with '[userName]' in templates. Similarly, with the signal-based input() function: 'userName = input<string>({ alias: \"name\" })' means you access 'this.userName()' internally but bind with '[name]' in templates. This dual naming makes the code harder to understand, complicates refactoring, and can cause bugs when developers forget which name to use in which context. Keep the internal and external names the same unless you have a strong reason for the mismatch.",
};
