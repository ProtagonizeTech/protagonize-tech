"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OUTPUT_PROPERTY_OR_GETTER = exports.OUTPUT_ALIAS = exports.OUTPUTS_METADATA_PROPERTY_LITERAL = exports.INPUT_PROPERTY_OR_SETTER = exports.INPUT_ALIAS = exports.INPUTS_METADATA_PROPERTY_LITERAL = exports.COMPONENT_OR_DIRECTIVE_SELECTOR_LITERAL = exports.DIRECTIVE_SELECTOR_LITERAL = exports.COMPONENT_SELECTOR_LITERAL = exports.ALIAS_PROPERTY_VALUE = exports.LITERAL_OR_TEMPLATE_ELEMENT = exports.HOST_LISTENER_DECORATOR = exports.HOST_BINDING_DECORATOR = exports.OUTPUT_DECORATOR = exports.INPUT_DECORATOR = exports.MODULE_CLASS_DECORATOR = exports.INJECTABLE_CLASS_DECORATOR = exports.PIPE_CLASS_DECORATOR = exports.DIRECTIVE_CLASS_DECORATOR = exports.COMPONENT_CLASS_DECORATOR = exports.COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR = void 0;
exports.decoratorDefinition = decoratorDefinition;
exports.metadataProperty = metadataProperty;
exports.methodDefinition = methodDefinition;
exports.COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR = 'ClassDeclaration > Decorator[expression.callee.name=/^(Component|Directive)$/]';
exports.COMPONENT_CLASS_DECORATOR = 'ClassDeclaration > Decorator[expression.callee.name="Component"]';
exports.DIRECTIVE_CLASS_DECORATOR = 'ClassDeclaration > Decorator[expression.callee.name="Directive"]';
exports.PIPE_CLASS_DECORATOR = 'ClassDeclaration > Decorator[expression.callee.name="Pipe"]';
exports.INJECTABLE_CLASS_DECORATOR = 'ClassDeclaration > Decorator[expression.callee.name="Injectable"]';
exports.MODULE_CLASS_DECORATOR = 'ClassDeclaration > Decorator[expression.callee.name="NgModule"]';
exports.INPUT_DECORATOR = 'Decorator[expression.callee.name="Input"]';
exports.OUTPUT_DECORATOR = 'Decorator[expression.callee.name="Output"]';
exports.HOST_BINDING_DECORATOR = 'Decorator[expression.callee.name="HostBinding"]';
exports.HOST_LISTENER_DECORATOR = 'Decorator[expression.callee.name="HostListener"]';
exports.LITERAL_OR_TEMPLATE_ELEMENT = ':matches(Literal, TemplateElement)';
exports.ALIAS_PROPERTY_VALUE = `ObjectExpression > Property[key.name='alias'] ${exports.LITERAL_OR_TEMPLATE_ELEMENT}`;
function decoratorDefinition(decoratorName) {
    return `ClassDeclaration:has(Decorator[expression.callee.name=${decoratorName}])`;
}
function metadataProperty(key) {
    return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}
function methodDefinition(key) {
    return `MethodDefinition:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`;
}
exports.COMPONENT_SELECTOR_LITERAL = `${exports.COMPONENT_CLASS_DECORATOR} ${metadataProperty('selector')} ${exports.LITERAL_OR_TEMPLATE_ELEMENT}`;
exports.DIRECTIVE_SELECTOR_LITERAL = `${exports.DIRECTIVE_CLASS_DECORATOR} ${metadataProperty('selector')} ${exports.LITERAL_OR_TEMPLATE_ELEMENT}`;
exports.COMPONENT_OR_DIRECTIVE_SELECTOR_LITERAL = `:matches(${exports.COMPONENT_SELECTOR_LITERAL}, ${exports.DIRECTIVE_SELECTOR_LITERAL})`;
exports.INPUTS_METADATA_PROPERTY_LITERAL = `${exports.COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR} ${metadataProperty('inputs')} > ArrayExpression ${exports.LITERAL_OR_TEMPLATE_ELEMENT}`;
exports.INPUT_ALIAS = [
    `:matches(PropertyDefinition, MethodDefinition[kind='set']) ${exports.INPUT_DECORATOR} > CallExpression > Literal`,
    `:matches(PropertyDefinition, MethodDefinition[kind='set']) ${exports.INPUT_DECORATOR} > CallExpression > TemplateLiteral > TemplateElement`,
    `:matches(PropertyDefinition, MethodDefinition[kind='set']) ${exports.INPUT_DECORATOR} > CallExpression > ${exports.ALIAS_PROPERTY_VALUE}`,
    `PropertyDefinition > CallExpression[callee.name='input'] > ${exports.ALIAS_PROPERTY_VALUE}`,
    `PropertyDefinition > CallExpression:has(MemberExpression[object.name='input'][property.name='required']) > ${exports.ALIAS_PROPERTY_VALUE}`,
].join(',');
exports.INPUT_PROPERTY_OR_SETTER = `:matches(PropertyDefinition, MethodDefinition[kind='set'])[computed=false]:has(${exports.INPUT_DECORATOR}) > :matches(Identifier, Literal)`;
exports.OUTPUTS_METADATA_PROPERTY_LITERAL = `${exports.COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR} ${metadataProperty('outputs')} > ArrayExpression ${exports.LITERAL_OR_TEMPLATE_ELEMENT}`;
exports.OUTPUT_ALIAS = [
    `:matches(PropertyDefinition, MethodDefinition[kind='get']) ${exports.OUTPUT_DECORATOR} ${exports.LITERAL_OR_TEMPLATE_ELEMENT}`,
    `PropertyDefinition > CallExpression[callee.name='output'] > ${exports.ALIAS_PROPERTY_VALUE}`,
].join(',');
exports.OUTPUT_PROPERTY_OR_GETTER = [
    `:matches(PropertyDefinition, MethodDefinition[kind='get'])[computed=false]:has(${exports.OUTPUT_DECORATOR}) > :matches(Identifier, Literal)`,
    `PropertyDefinition[computed=false]:has(CallExpression[callee.name='output']) > :matches(Identifier, Literal)`,
].join(',');
