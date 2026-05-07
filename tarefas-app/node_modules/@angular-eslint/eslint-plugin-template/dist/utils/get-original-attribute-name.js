"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOriginalAttributeName = getOriginalAttributeName;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
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
function getOriginalAttributeName(attribute) {
    const { details } = attribute.keySpan ?? {};
    if (!details) {
        return attribute.name;
    }
    if (attribute instanceof bundled_angular_compiler_1.TmplAstBoundEvent) {
        return isTwoWayDataBinding(attribute) ? attribute.name : details;
    }
    return details.replace('attr.', '');
}
function isTwoWayDataBinding({ keySpan: { details }, name, }) {
    return name === `${details}Change`;
}
