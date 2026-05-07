import type { Path } from '@angular-devkit/core';
import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
export declare const supportedFlatConfigNames: string[];
/**
 * This method is specifically for reading JSON files in a Tree
 * @param host The host tree
 * @param path The path to the JSON file
 * @returns The JSON data in the file.
 */
export declare function readJsonInTree<T = any>(host: Tree, path: string): T;
/**
 * This method is specifically for updating JSON in a Tree
 * @param path Path of JSON file in the Tree
 * @param callback Manipulation of the JSON data
 * @returns A rule which updates a JSON file in a Tree
 */
export declare function updateJsonInTree<T = any, O = T>(path: string, callback: (json: T, context: SchematicContext) => O): Rule;
type TargetsConfig = Record<string, {
    builder: string;
    options: unknown;
}>;
export declare function getTargetsConfigFromProject(projectConfig: {
    architect?: TargetsConfig;
} & {
    targets?: TargetsConfig;
}): TargetsConfig | null;
export declare function addESLintTargetToProject(projectName: string, targetName: 'eslint' | 'lint'): Rule;
/**
 * Utility to act on all files in a tree that are not ignored by git.
 */
export declare function visitNotIgnoredFiles(visitor: (file: Path, host: Tree, context: SchematicContext) => void | Rule, dir?: Path): Rule;
export declare function createRootESLintConfig(prefix: string | null): {
    root: boolean;
    ignorePatterns: string[];
    overrides: {
        files: string[];
        extends: string[];
        rules: {
            '@angular-eslint/directive-selector': (string | {
                type: string;
                prefix: string;
                style: string;
            })[];
            '@angular-eslint/component-selector': (string | {
                type: string;
                prefix: string;
                style: string;
            })[];
        } | {
            '@angular-eslint/directive-selector'?: undefined;
            '@angular-eslint/component-selector'?: undefined;
        };
    }[];
};
export declare function createStringifiedRootESLintConfig(prefix: string | null, isESM: boolean): string;
export declare function createESLintConfigForProject(projectName: string, setParserOptionsProject: boolean): Rule;
export declare function sortObjectByKeys(obj: Record<string, unknown>): Record<string, unknown>;
/**
 * To make certain schematic usage conversion more ergonomic, if the user does not specify a project
 * and only has a single project in their angular.json we will just go ahead and use that one.
 */
export declare function determineTargetProjectName(tree: Tree, maybeProject?: string): string | null;
/**
 * See `schematicCollections` docs here:
 * https://github.com/angular/angular-cli/blob/8431b3f0769b5f95b9e13807a09293d820c4b017/docs/specifications/schematic-collections-config.md
 */
export declare function updateSchematicCollections(angularJson: Record<string, any>, collectionName: '@angular-eslint/schematics' | 'angular-eslint'): Record<string, any>;
export declare function updateSchematicDefaults(angularJson: Record<string, any>, schematicFullName: string, defaultValues: Record<string, unknown>): Record<string, any>;
/**
 * In order to support both flat config and eslintrc we need to dynamically figure out
 * what the user should be using based on:
 * - their existing files
 * - their eslint version
 */
export declare function shouldUseFlatConfig(tree: Tree, existingJson?: Record<string, unknown>): boolean;
export declare function resolveRootESLintConfigPath(tree: Tree): string | null;
export declare function determineNewProjectESLintConfigContentAndExtension(tree: Tree, rootConfigPath: string, projectRoot: string): {
    isESM: boolean;
    ext: string;
};
export {};
//# sourceMappingURL=utils.d.ts.map