"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifecycleInterfaceByMethodName = exports.getMethodName = exports.getDeclaredMethods = exports.getDecoratorPropertyValue = exports.getDecoratorProperty = exports.getDecoratorProperties = exports.isAngularInnerClassDecorator = exports.isAngularClassDecorator = exports.isAngularLifecycleMethod = exports.isAngularLifecycleInterface = exports.ANGULAR_LIFECYCLE_METHODS = exports.ANGULAR_LIFECYCLE_INTERFACES = exports.getDecoratorName = exports.getDecoratorArgument = exports.getAngularClassDecorator = exports.getDecorator = exports.getClassName = exports.getDeclaredAngularLifecycleMethods = exports.getDeclaredAngularLifecycleInterfaces = exports.getPipeDecorator = exports.ANGULAR_CLASS_DECORATOR_MAPPER = exports.ANGULAR_CLASS_DECORATORS = exports.ANGULAR_INNER_CLASS_DECORATORS = exports.ANGULAR_CLASS_DECORATOR_LIFECYCLE_METHOD_MAPPER = exports.angularLifecycleMethodsOrdered = exports.angularLifecycleMethodKeys = exports.angularLifecycleInterfaceKeys = exports.angularInnerClassDecoratorKeys = exports.angularClassDecoratorKeys = exports.OPTION_STYLE_KEBAB_CASE = exports.OPTION_STYLE_CAMEL_CASE = exports.AngularLifecycleMethods = exports.AngularLifecycleInterfaces = exports.AngularInnerClassDecorators = exports.AngularClassDecorators = void 0;
exports.getCorrespondentImportClause = getCorrespondentImportClause;
exports.getImportDeclarations = getImportDeclarations;
exports.getImportDeclarationSpecifier = getImportDeclarationSpecifier;
exports.getInterface = getInterface;
exports.getInterfaceName = getInterfaceName;
exports.getInterfaces = getInterfaces;
exports.getDeclaredInterfaceNames = getDeclaredInterfaceNames;
exports.getNearestNodeFrom = getNearestNodeFrom;
exports.getPropertyDefinitionName = getPropertyDefinitionName;
exports.isImportedFrom = isImportedFrom;
exports.getRawText = getRawText;
exports.getReplacementText = getReplacementText;
exports.isCallExpression = isCallExpression;
exports.isMemberExpression = isMemberExpression;
exports.isIdentifierOrMemberExpression = isIdentifierOrMemberExpression;
exports.isClassDeclaration = isClassDeclaration;
exports.isPropertyDefinition = isPropertyDefinition;
exports.isPropertyOrMethodDefinition = isPropertyOrMethodDefinition;
exports.isImportDefaultSpecifier = isImportDefaultSpecifier;
exports.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
exports.isObjectExpression = isObjectExpression;
exports.isArrayExpression = isArrayExpression;
exports.isProperty = isProperty;
exports.isLiteral = isLiteral;
exports.isTemplateElement = isTemplateElement;
exports.isTemplateLiteral = isTemplateLiteral;
exports.isImportDeclaration = isImportDeclaration;
exports.isImportSpecifier = isImportSpecifier;
exports.isStringLiteral = isStringLiteral;
exports.isMethodDefinition = isMethodDefinition;
exports.isSuper = isSuper;
exports.isImplementsToken = isImplementsToken;
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("../utils");
var AngularClassDecorators;
(function (AngularClassDecorators) {
    AngularClassDecorators["Component"] = "Component";
    AngularClassDecorators["Directive"] = "Directive";
    AngularClassDecorators["Injectable"] = "Injectable";
    AngularClassDecorators["NgModule"] = "NgModule";
    AngularClassDecorators["Pipe"] = "Pipe";
})(AngularClassDecorators || (exports.AngularClassDecorators = AngularClassDecorators = {}));
var AngularConstructorParameterDecorators;
(function (AngularConstructorParameterDecorators) {
    AngularConstructorParameterDecorators["Attribute"] = "Attribute";
    AngularConstructorParameterDecorators["Host"] = "Host";
    AngularConstructorParameterDecorators["Inject"] = "Inject";
    AngularConstructorParameterDecorators["Optional"] = "Optional";
    AngularConstructorParameterDecorators["Self"] = "Self";
    AngularConstructorParameterDecorators["SkipSelf"] = "SkipSelf";
})(AngularConstructorParameterDecorators || (AngularConstructorParameterDecorators = {}));
var AngularMethodDecorators;
(function (AngularMethodDecorators) {
    AngularMethodDecorators["HostListener"] = "HostListener";
})(AngularMethodDecorators || (AngularMethodDecorators = {}));
var AngularPropertyAccessorDecorators;
(function (AngularPropertyAccessorDecorators) {
    AngularPropertyAccessorDecorators["ContentChild"] = "ContentChild";
    AngularPropertyAccessorDecorators["ContentChildren"] = "ContentChildren";
    AngularPropertyAccessorDecorators["HostBinding"] = "HostBinding";
    AngularPropertyAccessorDecorators["Input"] = "Input";
    AngularPropertyAccessorDecorators["Output"] = "Output";
    AngularPropertyAccessorDecorators["ViewChild"] = "ViewChild";
    AngularPropertyAccessorDecorators["ViewChildren"] = "ViewChildren";
})(AngularPropertyAccessorDecorators || (AngularPropertyAccessorDecorators = {}));
exports.AngularInnerClassDecorators = {
    ...AngularConstructorParameterDecorators,
    ...AngularMethodDecorators,
    ...AngularPropertyAccessorDecorators,
};
var AngularLifecycleInterfaces;
(function (AngularLifecycleInterfaces) {
    AngularLifecycleInterfaces["AfterContentChecked"] = "AfterContentChecked";
    AngularLifecycleInterfaces["AfterContentInit"] = "AfterContentInit";
    AngularLifecycleInterfaces["AfterViewChecked"] = "AfterViewChecked";
    AngularLifecycleInterfaces["AfterViewInit"] = "AfterViewInit";
    AngularLifecycleInterfaces["DoBootstrap"] = "DoBootstrap";
    AngularLifecycleInterfaces["DoCheck"] = "DoCheck";
    AngularLifecycleInterfaces["OnChanges"] = "OnChanges";
    AngularLifecycleInterfaces["OnDestroy"] = "OnDestroy";
    AngularLifecycleInterfaces["OnInit"] = "OnInit";
})(AngularLifecycleInterfaces || (exports.AngularLifecycleInterfaces = AngularLifecycleInterfaces = {}));
var AngularLifecycleMethods;
(function (AngularLifecycleMethods) {
    AngularLifecycleMethods["ngAfterContentChecked"] = "ngAfterContentChecked";
    AngularLifecycleMethods["ngAfterContentInit"] = "ngAfterContentInit";
    AngularLifecycleMethods["ngAfterViewChecked"] = "ngAfterViewChecked";
    AngularLifecycleMethods["ngAfterViewInit"] = "ngAfterViewInit";
    AngularLifecycleMethods["ngDoBootstrap"] = "ngDoBootstrap";
    AngularLifecycleMethods["ngDoCheck"] = "ngDoCheck";
    AngularLifecycleMethods["ngOnChanges"] = "ngOnChanges";
    AngularLifecycleMethods["ngOnDestroy"] = "ngOnDestroy";
    AngularLifecycleMethods["ngOnInit"] = "ngOnInit";
})(AngularLifecycleMethods || (exports.AngularLifecycleMethods = AngularLifecycleMethods = {}));
exports.OPTION_STYLE_CAMEL_CASE = 'camelCase';
exports.OPTION_STYLE_KEBAB_CASE = 'kebab-case';
exports.angularClassDecoratorKeys = (0, utils_2.objectKeys)(AngularClassDecorators);
exports.angularInnerClassDecoratorKeys = (0, utils_2.objectKeys)(exports.AngularInnerClassDecorators);
exports.angularLifecycleInterfaceKeys = (0, utils_2.objectKeys)(AngularLifecycleInterfaces);
exports.angularLifecycleMethodKeys = (0, utils_2.objectKeys)(AngularLifecycleMethods);
/**
 * See lifecycle event sequence:
 * https://angular.dev/guide/components/lifecycle
 */
exports.angularLifecycleMethodsOrdered = [
    AngularLifecycleMethods.ngOnChanges,
    AngularLifecycleMethods.ngOnInit,
    AngularLifecycleMethods.ngDoCheck,
    AngularLifecycleMethods.ngAfterContentInit,
    AngularLifecycleMethods.ngAfterContentChecked,
    AngularLifecycleMethods.ngAfterViewInit,
    AngularLifecycleMethods.ngAfterViewChecked,
    AngularLifecycleMethods.ngOnDestroy,
];
exports.ANGULAR_CLASS_DECORATOR_LIFECYCLE_METHOD_MAPPER = new Map([
    [
        AngularClassDecorators.Component,
        new Set([
            AngularLifecycleMethods.ngAfterContentChecked,
            AngularLifecycleMethods.ngAfterContentInit,
            AngularLifecycleMethods.ngAfterViewChecked,
            AngularLifecycleMethods.ngAfterViewInit,
            AngularLifecycleMethods.ngOnChanges,
            AngularLifecycleMethods.ngOnDestroy,
            AngularLifecycleMethods.ngOnInit,
            AngularLifecycleMethods.ngDoCheck,
        ]),
    ],
    [
        AngularClassDecorators.Directive,
        new Set([
            AngularLifecycleMethods.ngAfterContentChecked,
            AngularLifecycleMethods.ngAfterContentInit,
            AngularLifecycleMethods.ngAfterViewChecked,
            AngularLifecycleMethods.ngAfterViewInit,
            AngularLifecycleMethods.ngOnChanges,
            AngularLifecycleMethods.ngOnDestroy,
            AngularLifecycleMethods.ngOnInit,
            AngularLifecycleMethods.ngDoCheck,
        ]),
    ],
    [
        AngularClassDecorators.Injectable,
        new Set([AngularLifecycleMethods.ngOnDestroy]),
    ],
    [
        AngularClassDecorators.NgModule,
        new Set([
            AngularLifecycleMethods.ngDoBootstrap,
        ]),
    ],
    [
        AngularClassDecorators.Pipe,
        new Set([AngularLifecycleMethods.ngOnDestroy]),
    ],
]);
exports.ANGULAR_INNER_CLASS_DECORATORS = new Set(exports.angularInnerClassDecoratorKeys);
exports.ANGULAR_CLASS_DECORATORS = new Set(exports.angularClassDecoratorKeys);
exports.ANGULAR_CLASS_DECORATOR_MAPPER = new Map([
    [AngularClassDecorators.Component, exports.ANGULAR_INNER_CLASS_DECORATORS],
    [AngularClassDecorators.Directive, exports.ANGULAR_INNER_CLASS_DECORATORS],
    [
        AngularClassDecorators.Injectable,
        new Set([
            exports.AngularInnerClassDecorators.Host,
            exports.AngularInnerClassDecorators.Inject,
            exports.AngularInnerClassDecorators.Optional,
            exports.AngularInnerClassDecorators.Self,
            exports.AngularInnerClassDecorators.SkipSelf,
        ]),
    ],
    [
        AngularClassDecorators.NgModule,
        new Set([
            exports.AngularInnerClassDecorators.Host,
            exports.AngularInnerClassDecorators.Inject,
            exports.AngularInnerClassDecorators.Optional,
            exports.AngularInnerClassDecorators.Self,
            exports.AngularInnerClassDecorators.SkipSelf,
        ]),
    ],
    [
        AngularClassDecorators.Pipe,
        new Set([
            exports.AngularInnerClassDecorators.Host,
            exports.AngularInnerClassDecorators.Inject,
            exports.AngularInnerClassDecorators.Optional,
            exports.AngularInnerClassDecorators.Self,
            exports.AngularInnerClassDecorators.SkipSelf,
        ]),
    ],
]);
function getCorrespondentImportClause(importDeclarations, compatibleWithTypeOnlyImport = false) {
    let importClause;
    for (const { importKind, specifiers } of importDeclarations) {
        const lastImportSpecifier = (0, utils_2.getLast)(specifiers);
        if ((!compatibleWithTypeOnlyImport && importKind === 'type') ||
            isImportNamespaceSpecifier(lastImportSpecifier)) {
            continue;
        }
        importClause = lastImportSpecifier;
    }
    return importClause;
}
function getImportDeclarations(node, moduleName) {
    let parentNode = node;
    while ((parentNode = parentNode.parent)) {
        if (!isProgram(parentNode))
            continue;
        return parentNode.body.filter((node) => isImportDeclaration(node) && node.source.value === moduleName);
    }
    return parentNode;
}
function getImportDeclarationSpecifier(importDeclarations, importName) {
    for (const importDeclaration of importDeclarations) {
        const importSpecifier = importDeclaration.specifiers.find((importClause) => {
            return (isImportSpecifier(importClause) &&
                ((utils_1.ASTUtils.isIdentifier(importClause.imported) &&
                    importClause.imported.name === importName) ||
                    (isStringLiteral(importClause.imported) &&
                        importClause.imported.value === importName)));
        });
        if (importSpecifier) {
            return { importDeclaration, importSpecifier };
        }
    }
    return undefined;
}
function getInterface(node, interfaceName) {
    return getInterfaces(node).find((interfaceMember) => getInterfaceName(interfaceMember) === interfaceName);
}
function getInterfaceName(interfaceMember) {
    if (utils_1.ASTUtils.isIdentifier(interfaceMember)) {
        return interfaceMember.name;
    }
    return utils_1.ASTUtils.isIdentifier(interfaceMember.property)
        ? interfaceMember.property.name
        : undefined;
}
const getPipeDecorator = (node) => (0, exports.getDecorator)(node, 'Pipe');
exports.getPipeDecorator = getPipeDecorator;
function getInterfaces(node) {
    return (node.implements ?? [])
        .map(({ expression }) => expression)
        .filter(isIdentifierOrMemberExpression);
}
function getDeclaredInterfaceNames(node) {
    return getInterfaces(node).map(getInterfaceName).filter(utils_2.isNotNullOrUndefined);
}
const getDeclaredAngularLifecycleInterfaces = (node) => getDeclaredInterfaceNames(node).filter(exports.isAngularLifecycleInterface);
exports.getDeclaredAngularLifecycleInterfaces = getDeclaredAngularLifecycleInterfaces;
const getDeclaredAngularLifecycleMethods = (node) => (0, exports.getDeclaredMethods)(node)
    .map(exports.getMethodName)
    .filter(utils_2.isNotNullOrUndefined)
    .filter(exports.isAngularLifecycleMethod);
exports.getDeclaredAngularLifecycleMethods = getDeclaredAngularLifecycleMethods;
function getNearestNodeFrom({ parent }, predicate) {
    while (parent && !isProgram(parent)) {
        if (predicate(parent)) {
            return parent;
        }
        parent = parent.parent;
    }
    return null;
}
const getClassName = (node) => {
    if (isClassDeclaration(node)) {
        return node.id?.name;
    }
    if (node.parent) {
        return (0, exports.getClassName)(node.parent);
    }
    return undefined;
};
exports.getClassName = getClassName;
const getDecorator = (node, decoratorName) => {
    return node.decorators?.find((decorator) => (0, exports.getDecoratorName)(decorator) === decoratorName);
};
exports.getDecorator = getDecorator;
const getAngularClassDecorator = ({ decorators, }) => {
    return decorators
        ?.map(exports.getDecoratorName)
        .filter(utils_2.isNotNullOrUndefined)
        .find(exports.isAngularClassDecorator);
};
exports.getAngularClassDecorator = getAngularClassDecorator;
const getDecoratorArgument = ({ expression, }) => {
    if (!isCallExpression(expression) || expression.arguments.length === 0) {
        return undefined;
    }
    const [arg] = expression.arguments;
    return isObjectExpression(arg) && arg.properties ? arg : undefined;
};
exports.getDecoratorArgument = getDecoratorArgument;
const getDecoratorName = ({ expression, }) => {
    if (utils_1.ASTUtils.isIdentifier(expression))
        return expression.name;
    return isCallExpression(expression) &&
        utils_1.ASTUtils.isIdentifier(expression.callee)
        ? expression.callee.name
        : undefined;
};
exports.getDecoratorName = getDecoratorName;
exports.ANGULAR_LIFECYCLE_INTERFACES = new Set(exports.angularLifecycleInterfaceKeys);
exports.ANGULAR_LIFECYCLE_METHODS = new Set(exports.angularLifecycleMethodKeys);
const isAngularLifecycleInterface = (value) => exports.ANGULAR_LIFECYCLE_INTERFACES.has(value);
exports.isAngularLifecycleInterface = isAngularLifecycleInterface;
const isAngularLifecycleMethod = (value) => exports.ANGULAR_LIFECYCLE_METHODS.has(value);
exports.isAngularLifecycleMethod = isAngularLifecycleMethod;
const isAngularClassDecorator = (value) => exports.ANGULAR_CLASS_DECORATORS.has(value);
exports.isAngularClassDecorator = isAngularClassDecorator;
const isAngularInnerClassDecorator = (value) => exports.ANGULAR_INNER_CLASS_DECORATORS.has(value);
exports.isAngularInnerClassDecorator = isAngularInnerClassDecorator;
/**
 * `PropertyDefinition` nodes can have different types of `key`s
 *
 * E.g.
 *
 * class Foo {
 *  a // Identifier
 * 'b' // Literal
 *  ['c'] // Literal
 * }
 */
function getPropertyDefinitionName({ computed, key, }) {
    if (utils_1.ASTUtils.isIdentifier(key) && !computed) {
        return key.name;
    }
    if (isLiteral(key)) {
        return key.raw;
    }
    throw new Error(`Unexpected "PropertyDefinition.key.type" provided: ${key.type}`);
}
const getDecoratorProperties = (decorator) => {
    return (0, exports.getDecoratorArgument)(decorator)?.properties.filter(isProperty) ?? [];
};
exports.getDecoratorProperties = getDecoratorProperties;
const getDecoratorProperty = (decorator, name) => {
    return (0, exports.getDecoratorProperties)(decorator).find(({ key }) => utils_1.ASTUtils.isIdentifier(key) && key.name === name);
};
exports.getDecoratorProperty = getDecoratorProperty;
const getDecoratorPropertyValue = (decorator, name) => {
    return (0, exports.getDecoratorProperty)(decorator, name)?.value;
};
exports.getDecoratorPropertyValue = getDecoratorPropertyValue;
const getDeclaredMethods = ({ body: { body }, }) => {
    return body.filter(isMethodDefinition);
};
exports.getDeclaredMethods = getDeclaredMethods;
const getMethodName = ({ computed, key, }) => {
    if (isStringLiteral(key)) {
        return key.value;
    }
    return utils_1.ASTUtils.isIdentifier(key) && !computed ? key.name : undefined;
};
exports.getMethodName = getMethodName;
const getLifecycleInterfaceByMethodName = (methodName) => methodName.slice(2);
exports.getLifecycleInterfaceByMethodName = getLifecycleInterfaceByMethodName;
function isImportedFrom(identifier, moduleName) {
    const importDeclarations = getImportDeclarations(identifier, moduleName);
    return Boolean(importDeclarations?.some((importDeclaration) => importDeclaration.specifiers.some((specifier) => isImportSpecifier(specifier) &&
        ((utils_1.ASTUtils.isIdentifier(specifier.imported) &&
            specifier.imported.name === identifier.name) ||
            (isStringLiteral(specifier.imported) &&
                specifier.imported.value === identifier.name)) &&
        specifier.local.name === identifier.name)));
}
function getRawText(node) {
    if (utils_1.ASTUtils.isIdentifier(node)) {
        return node.name;
    }
    if (isPropertyDefinition(node) ||
        isMethodDefinition(node) ||
        isProperty(node)) {
        return getRawText(node.key);
    }
    if (isLiteral(node)) {
        return String(node.value);
    }
    if (isTemplateElement(node)) {
        return node.value.raw;
    }
    if (isTemplateLiteral(node)) {
        return node.quasis[0].value.raw;
    }
    throw Error(`Unexpected \`node.type\` provided: ${node.type}`);
}
function getReplacementText(node, text) {
    return isLiteral(node) ? `'${text}'` : `\`${text}\``;
}
// SECTION START:
// Equivalents of utils exported by TypeScript itself for its own AST
function isCallExpression(node) {
    return node.type === utils_1.AST_NODE_TYPES.CallExpression;
}
function isMemberExpression(node) {
    return node.type === utils_1.AST_NODE_TYPES.MemberExpression;
}
function isIdentifierOrMemberExpression(node) {
    return utils_1.ASTUtils.isIdentifier(node) || isMemberExpression(node);
}
function isClassDeclaration(node) {
    return node.type === utils_1.AST_NODE_TYPES.ClassDeclaration;
}
function isPropertyDefinition(node) {
    return node.type === utils_1.AST_NODE_TYPES.PropertyDefinition;
}
function isPropertyOrMethodDefinition(node) {
    return isPropertyDefinition(node) || isMethodDefinition(node);
}
function isImportDefaultSpecifier(node) {
    return node.type === utils_1.AST_NODE_TYPES.ImportDefaultSpecifier;
}
function isImportNamespaceSpecifier(node) {
    return node.type === utils_1.AST_NODE_TYPES.ImportNamespaceSpecifier;
}
function isObjectExpression(node) {
    return node.type === utils_1.AST_NODE_TYPES.ObjectExpression;
}
function isArrayExpression(node) {
    return node.type === utils_1.AST_NODE_TYPES.ArrayExpression;
}
function isProperty(node) {
    return node.type === utils_1.AST_NODE_TYPES.Property;
}
function isProgram(node) {
    return node.type === utils_1.AST_NODE_TYPES.Program;
}
function isLiteral(node) {
    return node.type === utils_1.AST_NODE_TYPES.Literal;
}
function isTemplateElement(node) {
    return node.type === utils_1.AST_NODE_TYPES.TemplateElement;
}
function isTemplateLiteral(node) {
    return node.type === utils_1.AST_NODE_TYPES.TemplateLiteral;
}
function isImportDeclaration(node) {
    return node.type === utils_1.AST_NODE_TYPES.ImportDeclaration;
}
function isImportSpecifier(node) {
    return node.type === utils_1.AST_NODE_TYPES.ImportSpecifier;
}
/**
 * `ESTree` does not differentiate between different types of `Literals` at the `AST` level,
 * but it is a common thing to need to do, so this utility are here to
 * avoid repeated `typeof` checks on the node's value.
 */
function isStringLiteral(node) {
    return isLiteral(node) && typeof node.value === 'string';
}
function isMethodDefinition(node) {
    return node.type === utils_1.AST_NODE_TYPES.MethodDefinition;
}
function isSuper(node) {
    return node.type === utils_1.AST_NODE_TYPES.Super;
}
function isImplementsToken(token) {
    return token.type === utils_1.AST_TOKEN_TYPES.Keyword && token.value === 'implements';
}
// SECTION END:
// Equivalents of utils exported by TypeScript itself for its own AST
