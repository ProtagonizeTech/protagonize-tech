import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
/**
 * Whether an element content cannot be read by a screen reader. It can happen in the following situations:
 * - It has `display: none` or `visibility: hidden` style;
 * - It has `aria-hidden` or `hidden` attribute;
 * - It's an `<input type="hidden">`;
 * - One of its ancestors met one of the following situations above.
 */
export declare function isHiddenFromScreenReader(node: TmplAstElement): boolean;
//# sourceMappingURL=is-hidden-from-screen-reader.d.ts.map