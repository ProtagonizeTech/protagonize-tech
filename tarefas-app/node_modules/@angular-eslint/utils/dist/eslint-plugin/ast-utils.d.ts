import type { TSESTree } from '@typescript-eslint/utils';
export declare enum AngularClassDecorators {
    Component = "Component",
    Directive = "Directive",
    Injectable = "Injectable",
    NgModule = "NgModule",
    Pipe = "Pipe"
}
declare enum AngularConstructorParameterDecorators {
    Attribute = "Attribute",
    Host = "Host",
    Inject = "Inject",
    Optional = "Optional",
    Self = "Self",
    SkipSelf = "SkipSelf"
}
declare enum AngularMethodDecorators {
    HostListener = "HostListener"
}
declare enum AngularPropertyAccessorDecorators {
    ContentChild = "ContentChild",
    ContentChildren = "ContentChildren",
    HostBinding = "HostBinding",
    Input = "Input",
    Output = "Output",
    ViewChild = "ViewChild",
    ViewChildren = "ViewChildren"
}
export declare const AngularInnerClassDecorators: {
    ContentChild: AngularPropertyAccessorDecorators.ContentChild;
    ContentChildren: AngularPropertyAccessorDecorators.ContentChildren;
    HostBinding: AngularPropertyAccessorDecorators.HostBinding;
    Input: AngularPropertyAccessorDecorators.Input;
    Output: AngularPropertyAccessorDecorators.Output;
    ViewChild: AngularPropertyAccessorDecorators.ViewChild;
    ViewChildren: AngularPropertyAccessorDecorators.ViewChildren;
    HostListener: AngularMethodDecorators.HostListener;
    Attribute: AngularConstructorParameterDecorators.Attribute;
    Host: AngularConstructorParameterDecorators.Host;
    Inject: AngularConstructorParameterDecorators.Inject;
    Optional: AngularConstructorParameterDecorators.Optional;
    Self: AngularConstructorParameterDecorators.Self;
    SkipSelf: AngularConstructorParameterDecorators.SkipSelf;
};
export declare enum AngularLifecycleInterfaces {
    AfterContentChecked = "AfterContentChecked",
    AfterContentInit = "AfterContentInit",
    AfterViewChecked = "AfterViewChecked",
    AfterViewInit = "AfterViewInit",
    DoBootstrap = "DoBootstrap",
    DoCheck = "DoCheck",
    OnChanges = "OnChanges",
    OnDestroy = "OnDestroy",
    OnInit = "OnInit"
}
export declare enum AngularLifecycleMethods {
    ngAfterContentChecked = "ngAfterContentChecked",
    ngAfterContentInit = "ngAfterContentInit",
    ngAfterViewChecked = "ngAfterViewChecked",
    ngAfterViewInit = "ngAfterViewInit",
    ngDoBootstrap = "ngDoBootstrap",
    ngDoCheck = "ngDoCheck",
    ngOnChanges = "ngOnChanges",
    ngOnDestroy = "ngOnDestroy",
    ngOnInit = "ngOnInit"
}
export declare const OPTION_STYLE_CAMEL_CASE: "camelCase";
export declare const OPTION_STYLE_KEBAB_CASE: "kebab-case";
export type SelectorStyle = typeof OPTION_STYLE_CAMEL_CASE | typeof OPTION_STYLE_KEBAB_CASE;
export type AngularClassDecoratorKeys = keyof typeof AngularClassDecorators;
export type AngularInnerClassDecoratorKeys = Exclude<keyof typeof AngularInnerClassDecorators, number>;
export type AngularLifecycleInterfaceKeys = keyof typeof AngularLifecycleInterfaces;
export type AngularLifecycleMethodKeys = keyof typeof AngularLifecycleMethods;
export declare const angularClassDecoratorKeys: readonly ("Component" | "Directive" | "Injectable" | "NgModule" | "Pipe")[];
export declare const angularInnerClassDecoratorKeys: readonly ("Attribute" | "Host" | "Inject" | "Optional" | "Self" | "SkipSelf" | "HostListener" | "ContentChild" | "ContentChildren" | "HostBinding" | "Input" | "Output" | "ViewChild" | "ViewChildren")[];
export declare const angularLifecycleInterfaceKeys: readonly ("AfterContentChecked" | "AfterContentInit" | "AfterViewChecked" | "AfterViewInit" | "DoBootstrap" | "DoCheck" | "OnChanges" | "OnDestroy" | "OnInit")[];
export declare const angularLifecycleMethodKeys: readonly ("ngAfterContentChecked" | "ngAfterContentInit" | "ngAfterViewChecked" | "ngAfterViewInit" | "ngDoBootstrap" | "ngDoCheck" | "ngOnChanges" | "ngOnDestroy" | "ngOnInit")[];
/**
 * See lifecycle event sequence:
 * https://angular.dev/guide/components/lifecycle
 */
export declare const angularLifecycleMethodsOrdered: AngularLifecycleMethods[];
export declare const ANGULAR_CLASS_DECORATOR_LIFECYCLE_METHOD_MAPPER: ReadonlyMap<AngularClassDecoratorKeys, ReadonlySet<AngularLifecycleMethodKeys>>;
export declare const ANGULAR_INNER_CLASS_DECORATORS: ReadonlySet<AngularInnerClassDecoratorKeys>;
export declare const ANGULAR_CLASS_DECORATORS: ReadonlySet<AngularClassDecoratorKeys>;
export declare const ANGULAR_CLASS_DECORATOR_MAPPER: ReadonlyMap<AngularClassDecoratorKeys, ReadonlySet<AngularInnerClassDecoratorKeys>>;
export declare function getCorrespondentImportClause(importDeclarations: readonly TSESTree.ImportDeclaration[], compatibleWithTypeOnlyImport?: boolean): TSESTree.ImportClause | undefined;
export declare function getImportDeclarations(node: TSESTree.Node, moduleName: string): readonly TSESTree.ImportDeclaration[] | undefined;
export declare function getImportDeclarationSpecifier(importDeclarations: readonly TSESTree.ImportDeclaration[], importName: string): {
    importSpecifier: TSESTree.ImportSpecifier;
    importDeclaration: TSESTree.ImportDeclaration;
} | undefined;
export declare function getInterface(node: TSESTree.ClassDeclaration, interfaceName: string): TSESTree.Identifier | TSESTree.MemberExpression | undefined;
export declare function getInterfaceName(interfaceMember: TSESTree.Identifier | TSESTree.MemberExpression): string | undefined;
export declare const getPipeDecorator: (node: TSESTree.ClassDeclaration) => TSESTree.Decorator | undefined;
export declare function getInterfaces(node: TSESTree.ClassDeclaration): readonly (TSESTree.Identifier | TSESTree.MemberExpression)[];
export declare function getDeclaredInterfaceNames(node: TSESTree.ClassDeclaration): readonly string[];
export declare const getDeclaredAngularLifecycleInterfaces: (node: TSESTree.ClassDeclaration) => readonly AngularLifecycleInterfaceKeys[];
export declare const getDeclaredAngularLifecycleMethods: (node: TSESTree.ClassDeclaration) => readonly AngularLifecycleMethodKeys[];
export declare function getNearestNodeFrom<T extends TSESTree.Node>({ parent }: TSESTree.Node, predicate: (parent: TSESTree.Node) => parent is T): T | null;
export declare const getClassName: (node: TSESTree.Node) => string | undefined;
export declare const getDecorator: (node: TSESTree.ClassDeclaration | TSESTree.PropertyDefinition | TSESTree.Identifier | TSESTree.MethodDefinition, decoratorName: string) => TSESTree.Decorator | undefined;
export declare const getAngularClassDecorator: ({ decorators, }: TSESTree.ClassDeclaration) => AngularClassDecoratorKeys | undefined;
export declare const getDecoratorArgument: ({ expression, }: TSESTree.Decorator) => TSESTree.ObjectExpression | undefined;
export declare const getDecoratorName: ({ expression, }: TSESTree.Decorator) => string | undefined;
export declare const ANGULAR_LIFECYCLE_INTERFACES: ReadonlySet<AngularLifecycleInterfaceKeys>;
export declare const ANGULAR_LIFECYCLE_METHODS: ReadonlySet<AngularLifecycleMethodKeys>;
export declare const isAngularLifecycleInterface: (value: string) => value is AngularLifecycleInterfaceKeys;
export declare const isAngularLifecycleMethod: (value: string) => value is AngularLifecycleMethodKeys;
export declare const isAngularClassDecorator: (value: string) => value is AngularClassDecoratorKeys;
export declare const isAngularInnerClassDecorator: (value: string) => value is AngularInnerClassDecoratorKeys;
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
export declare function getPropertyDefinitionName({ computed, key, }: TSESTree.PropertyDefinition): string;
export declare const getDecoratorProperties: (decorator: TSESTree.Decorator) => TSESTree.Property[];
export declare const getDecoratorProperty: (decorator: TSESTree.Decorator, name: string) => TSESTree.Property | undefined;
export declare const getDecoratorPropertyValue: (decorator: TSESTree.Decorator, name: string) => TSESTree.Property["value"] | undefined;
export declare const getDeclaredMethods: ({ body: { body }, }: TSESTree.ClassDeclaration) => readonly TSESTree.MethodDefinition[];
export declare const getMethodName: ({ computed, key, }: TSESTree.MethodDefinition) => string | undefined;
export declare const getLifecycleInterfaceByMethodName: (methodName: AngularLifecycleMethodKeys) => AngularLifecycleInterfaceKeys;
export declare function isImportedFrom(identifier: TSESTree.Identifier, moduleName: string): boolean;
export declare function getRawText(node: TSESTree.Node): string;
export declare function getReplacementText(node: TSESTree.Literal | TSESTree.TemplateElement | TSESTree.TemplateLiteral, text: string): string;
export declare function isCallExpression(node: TSESTree.Node): node is TSESTree.CallExpression;
export declare function isMemberExpression(node: TSESTree.Node): node is TSESTree.MemberExpression;
export declare function isIdentifierOrMemberExpression(node: TSESTree.Node): node is TSESTree.Identifier | TSESTree.MemberExpression;
export declare function isClassDeclaration(node: TSESTree.Node): node is TSESTree.ClassDeclaration;
export declare function isPropertyDefinition(node: TSESTree.Node): node is TSESTree.PropertyDefinition;
export declare function isPropertyOrMethodDefinition(node: TSESTree.Node): node is TSESTree.PropertyDefinition | TSESTree.MethodDefinition;
export declare function isImportDefaultSpecifier(node: TSESTree.Node): node is TSESTree.ImportDefaultSpecifier;
export declare function isImportNamespaceSpecifier(node: TSESTree.Node): node is TSESTree.ImportNamespaceSpecifier;
export declare function isObjectExpression(node: TSESTree.Node): node is TSESTree.ObjectExpression;
export declare function isArrayExpression(node: TSESTree.Node): node is TSESTree.ArrayExpression;
export declare function isProperty(node: TSESTree.Node): node is TSESTree.Property;
export declare function isLiteral(node: TSESTree.Node): node is TSESTree.Literal;
export declare function isTemplateElement(node: TSESTree.Node): node is TSESTree.TemplateElement;
export declare function isTemplateLiteral(node: TSESTree.Node): node is TSESTree.TemplateLiteral;
export declare function isImportDeclaration(node: TSESTree.Node): node is TSESTree.ImportDeclaration;
export declare function isImportSpecifier(node: TSESTree.Node): node is TSESTree.ImportSpecifier;
/**
 * `ESTree` does not differentiate between different types of `Literals` at the `AST` level,
 * but it is a common thing to need to do, so this utility are here to
 * avoid repeated `typeof` checks on the node's value.
 */
export declare function isStringLiteral(node: TSESTree.Node): node is TSESTree.StringLiteral;
export declare function isMethodDefinition(node: TSESTree.Node): node is TSESTree.MethodDefinition;
export declare function isSuper(node: TSESTree.Node): node is TSESTree.Super;
export declare function isImplementsToken(token: TSESTree.Token): token is TSESTree.KeywordToken & {
    value: 'implements';
};
export {};
//# sourceMappingURL=ast-utils.d.ts.map