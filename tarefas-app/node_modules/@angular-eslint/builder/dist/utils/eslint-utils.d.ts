import type { ESLint } from 'eslint';
import type { Schema } from '../schema';
export declare const supportedFlatConfigNames: string[];
export declare function resolveAndInstantiateESLint(eslintConfigPath: string | undefined, options: Schema, useFlatConfig?: boolean): Promise<{
    ESLint: typeof import("eslint").ESLint;
    eslint: ESLint;
}>;
//# sourceMappingURL=eslint-utils.d.ts.map