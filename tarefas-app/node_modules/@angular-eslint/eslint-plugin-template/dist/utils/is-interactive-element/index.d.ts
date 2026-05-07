import type { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
/**
 * Returns boolean indicating whether the given element is
 * interactive on the DOM or not. Usually used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * it's intention is to be interacted with on the DOM.
 */
export declare function isInherentlyInteractiveElement(node: TmplAstElement): boolean;
export declare function isNonInteractiveRole(node: TmplAstElement): boolean;
//# sourceMappingURL=index.d.ts.map