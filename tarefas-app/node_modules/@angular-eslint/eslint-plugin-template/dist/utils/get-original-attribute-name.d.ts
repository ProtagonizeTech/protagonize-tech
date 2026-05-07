import type { TmplAstBoundAttribute, TmplAstTextAttribute } from '@angular-eslint/bundled-angular-compiler';
import { TmplAstBoundEvent } from '@angular-eslint/bundled-angular-compiler';
/**
 * Returns the original attribute name.
 * @example
 * ```html
 * <div [style.display.none]="test"></div> <!-- Instead of "display", "style.display.none" -->
 * <div [attr.role]="'none'"></div> <!-- Instead of "attr.role", "role" -->
 * <div ([ngModel])="test"></div> <!-- Instead of "ngModel", "ngModelChange" -->
 * <div (@fade.start)="handle()"></div> <!-- Instead of "fade", "@fade.start" -->
 * ```
 */
export declare function getOriginalAttributeName(attribute: TmplAstBoundAttribute | TmplAstBoundEvent | TmplAstTextAttribute): string;
//# sourceMappingURL=get-original-attribute-name.d.ts.map