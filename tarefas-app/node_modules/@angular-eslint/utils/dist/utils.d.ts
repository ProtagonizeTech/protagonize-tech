/**
 * ===============================================================================
 *
 * This file contains general purpose utilities which are not specific to one of
 * the plugins.
 *
 * ===============================================================================
 */
/**
 * Return the last item of the given array.
 */
export declare function getLast<T extends readonly unknown[]>(items: T): T[number];
export declare const objectKeys: <T>(o: T) => readonly Extract<keyof T, string>[];
/**
 * Enforces the invariant that the input is an array.
 */
export declare function arrayify<T>(value: T | readonly T[]): readonly T[];
export declare const isNotNullOrUndefined: <T>(input: null | undefined | T) => input is T;
export declare const kebabToCamelCase: (value: string) => string;
/**
 * Convert an array to human-readable text.
 */
export declare const toHumanReadableText: (items: readonly string[]) => string;
export declare const toPattern: (value: readonly unknown[]) => RegExp;
export declare function capitalize<T extends string>(text: T): Capitalize<T>;
export declare function withoutBracketsAndWhitespaces(text: string): string;
//# sourceMappingURL=utils.d.ts.map