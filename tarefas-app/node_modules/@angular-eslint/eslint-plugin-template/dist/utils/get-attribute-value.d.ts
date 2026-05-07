import type { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
/**
 * Extracts the attribute value.
 * @example
 * ```ts
 * getAttributeValue(Element(`<div property="test"></div>`), 'nonExistent'); // null
 * getAttributeValue(Element(`<div aria-role="none"></div>`), 'role'); // 'none'
 * getAttributeValue(Element(`<div [attr.aria-checked]="true"></div>`), 'aria-checked'); // true
 * getAttributeValue(Element(`<button [variant]="variant"></button>`), 'variant'); // PROPERTY
 * ```
 */
export declare function getAttributeValue({ attributes, inputs }: TmplAstElement, attributeName: string): unknown;
//# sourceMappingURL=get-attribute-value.d.ts.map