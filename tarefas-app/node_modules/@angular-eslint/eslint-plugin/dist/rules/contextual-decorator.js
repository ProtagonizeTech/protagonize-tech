"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@angular-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
exports.RULE_NAME = 'contextual-decorator';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that classes use contextual decorators in their body',
        },
        schema: [],
        messages: {
            contextualDecorator: 'Decorator out of context for "@{{classDecoratorName}}()"',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            'MethodDefinition[kind=/^(get|set|method)$/], PropertyDefinition, TSParameterProperty'(node) {
                validateNode(context, node);
            },
        };
    },
});
function validateNode(context, node) {
    if (!node.decorators?.length) {
        return;
    }
    const classDeclaration = utils_1.ASTUtils.getNearestNodeFrom(node, utils_1.ASTUtils.isClassDeclaration);
    if (!classDeclaration) {
        return;
    }
    const classDecoratorName = utils_1.ASTUtils.getAngularClassDecorator(classDeclaration);
    if (!classDecoratorName) {
        return;
    }
    for (const decorator of node.decorators) {
        validateDecorator(context, decorator, classDecoratorName);
    }
}
function validateDecorator(context, decorator, classDecoratorName) {
    const decoratorName = utils_1.ASTUtils.getDecoratorName(decorator);
    if (!decoratorName || !utils_1.ASTUtils.isAngularInnerClassDecorator(decoratorName)) {
        return;
    }
    const allowedDecorators = utils_1.ASTUtils.ANGULAR_CLASS_DECORATOR_MAPPER.get(classDecoratorName);
    if (allowedDecorators?.has(decoratorName)) {
        return;
    }
    context.report({
        node: decorator,
        messageId: 'contextualDecorator',
        data: { classDecoratorName },
    });
}
exports.RULE_DOCS_EXTENSION = {
    rationale: `Angular decorators like @Input(), @Output(), @ViewChild(), and @HostBinding() are only meaningful in specific class types. For example, @Input() and @Output() only work in @Component or @Directive classes because they define the component/directive's API. Using these decorators in @Injectable() classes or @Pipe() classes will not work as expected, as Angular does not process these decorators in those contexts. This rule prevents bugs by ensuring decorators are only used where Angular will recognize and process them.`,
};
