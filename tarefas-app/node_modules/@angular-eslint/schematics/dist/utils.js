"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedFlatConfigNames = void 0;
exports.readJsonInTree = readJsonInTree;
exports.updateJsonInTree = updateJsonInTree;
exports.getTargetsConfigFromProject = getTargetsConfigFromProject;
exports.addESLintTargetToProject = addESLintTargetToProject;
exports.visitNotIgnoredFiles = visitNotIgnoredFiles;
exports.createRootESLintConfig = createRootESLintConfig;
exports.createStringifiedRootESLintConfig = createStringifiedRootESLintConfig;
exports.createESLintConfigForProject = createESLintConfigForProject;
exports.sortObjectByKeys = sortObjectByKeys;
exports.determineTargetProjectName = determineTargetProjectName;
exports.updateSchematicCollections = updateSchematicCollections;
exports.updateSchematicDefaults = updateSchematicDefaults;
exports.shouldUseFlatConfig = shouldUseFlatConfig;
exports.resolveRootESLintConfigPath = resolveRootESLintConfigPath;
exports.determineNewProjectESLintConfigContentAndExtension = determineNewProjectESLintConfigContentAndExtension;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ignore_1 = __importDefault(require("ignore"));
const semver_1 = __importDefault(require("semver"));
const strip_json_comments_1 = __importDefault(require("strip-json-comments"));
const DEFAULT_PREFIX = 'app';
exports.supportedFlatConfigNames = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    'eslint.config.ts',
    'eslint.config.mts',
    'eslint.config.cts',
];
/**
 * This method is specifically for reading JSON files in a Tree
 * @param host The host tree
 * @param path The path to the JSON file
 * @returns The JSON data in the file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJsonInTree(host, path) {
    if (!host.exists(path)) {
        throw new Error(`Cannot find ${path}`);
    }
    const contents = (0, strip_json_comments_1.default)(host.read(path).toString('utf-8'));
    try {
        return JSON.parse(contents);
    }
    catch (e) {
        throw new Error(`Cannot parse ${path}: ${e instanceof Error ? e.message : ''}`);
    }
}
/**
 * This method is specifically for updating JSON in a Tree
 * @param path Path of JSON file in the Tree
 * @param callback Manipulation of the JSON data
 * @returns A rule which updates a JSON file in a Tree
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateJsonInTree(path, callback) {
    return (host, context) => {
        if (!host.exists(path)) {
            host.create(path, serializeJson(callback({}, context)));
            return host;
        }
        host.overwrite(path, serializeJson(callback(readJsonInTree(host, path), context)));
        return host;
    };
}
function getTargetsConfigFromProject(projectConfig) {
    if (!projectConfig) {
        return null;
    }
    if (projectConfig.architect) {
        return projectConfig.architect;
    }
    // "targets" is an undocumented but supported alias of "architect"
    if (projectConfig.targets) {
        return projectConfig.targets;
    }
    return null;
}
function offsetFromRoot(fullPathToSourceDir) {
    const parts = (0, core_1.normalize)(fullPathToSourceDir).split('/');
    let offset = '';
    for (let i = 0; i < parts.length; ++i) {
        offset += '../';
    }
    return offset;
}
function serializeJson(json) {
    return `${JSON.stringify(json, null, 2)}\n`;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateWorkspaceInTree(callback) {
    return (host, context) => {
        const path = 'angular.json';
        host.overwrite(path, serializeJson(callback(readJsonInTree(host, path), context, host)));
        return host;
    };
}
function addESLintTargetToProject(projectName, targetName) {
    return updateWorkspaceInTree((workspaceJson, _, tree) => {
        const existingProjectConfig = workspaceJson.projects[projectName];
        let lintFilePatternsRoot = '';
        // Default Angular CLI project at the root of the workspace
        if (existingProjectConfig.root === '') {
            lintFilePatternsRoot = existingProjectConfig.sourceRoot || 'src';
        }
        else {
            lintFilePatternsRoot = existingProjectConfig.root;
        }
        const eslintTargetConfig = {
            builder: '@angular-eslint/builder:lint',
            options: {
                lintFilePatterns: [
                    `${lintFilePatternsRoot}/**/*.ts`,
                    `${lintFilePatternsRoot}/**/*.html`,
                ],
            },
        };
        let eslintConfig;
        if (existingProjectConfig.root !== '') {
            if (shouldUseFlatConfig(tree)) {
                const rootConfigPath = resolveRootESLintConfigPath(tree);
                if (!rootConfigPath ||
                    (!rootConfigPath.endsWith('js') && !rootConfigPath.endsWith('ts'))) {
                    throw new Error('Root ESLint config must be a JavaScript/TypeScript file (.js,.mjs,.cjs,.ts,.mts,.cts) when using Flat Config');
                }
                const { ext } = determineNewProjectESLintConfigContentAndExtension(tree, rootConfigPath, existingProjectConfig.root);
                const flatConfigPath = (0, core_1.join)(existingProjectConfig.root, `eslint.config.${ext}`);
                if (tree.exists(flatConfigPath)) {
                    eslintConfig = flatConfigPath;
                }
            }
        }
        eslintTargetConfig.options.eslintConfig = eslintConfig;
        existingProjectConfig.architect = existingProjectConfig.architect || {};
        existingProjectConfig.architect[targetName] = eslintTargetConfig;
        return workspaceJson;
    });
}
/**
 * Utility to act on all files in a tree that are not ignored by git.
 */
function visitNotIgnoredFiles(visitor, dir = (0, core_1.normalize)('')) {
    return (host, context) => {
        let ig;
        if (host.exists('.gitignore')) {
            ig = (0, ignore_1.default)();
            ig.add(host.read('.gitignore').toString());
        }
        function visit(_dir) {
            if (_dir && ig?.ignores(_dir)) {
                return;
            }
            const dirEntry = host.getDir(_dir);
            dirEntry.subfiles.forEach((file) => {
                if (ig?.ignores((0, core_1.join)(_dir, file))) {
                    return;
                }
                const maybeRule = visitor((0, core_1.join)(_dir, file), host, context);
                if (maybeRule) {
                    (0, schematics_1.callRule)(maybeRule, host, context).subscribe();
                }
            });
            dirEntry.subdirs.forEach((subdir) => {
                visit((0, core_1.join)(_dir, subdir));
            });
        }
        visit(dir);
    };
}
function setESLintProjectBasedOnProjectType(projectRoot, projectType, hasE2e) {
    let project;
    if (projectType === 'application') {
        project = [`${projectRoot}/tsconfig.(app|spec).json`];
        if (hasE2e) {
            project.push(`${projectRoot}/e2e/tsconfig.json`);
        }
    }
    // Libraries don't have an e2e directory
    if (projectType === 'library') {
        project = [`${projectRoot}/tsconfig.(lib|spec).json`];
    }
    return project;
}
function createRootESLintConfig(prefix) {
    let codeRules;
    if (prefix) {
        codeRules = {
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix, style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix, style: 'kebab-case' },
            ],
        };
    }
    else {
        codeRules = {};
    }
    return {
        root: true,
        ignorePatterns: ['projects/**/*'],
        overrides: [
            {
                files: ['*.ts'],
                extends: [
                    'eslint:recommended',
                    'plugin:@typescript-eslint/recommended',
                    'plugin:@angular-eslint/recommended',
                    'plugin:@angular-eslint/template/process-inline-templates',
                ],
                rules: codeRules,
            },
            {
                files: ['*.html'],
                extends: [
                    'plugin:@angular-eslint/template/recommended',
                    'plugin:@angular-eslint/template/accessibility',
                ],
                rules: {},
            },
        ],
    };
}
function createStringifiedRootESLintConfig(prefix, isESM) {
    return `// @ts-check
${isESM ? 'import eslint from "@eslint/js";' : 'const eslint = require("@eslint/js");'}
${isESM ? 'import { defineConfig } from "eslint/config";' : 'const { defineConfig } = require("eslint/config");'}
${isESM ? 'import tseslint from "typescript-eslint";' : 'const tseslint = require("typescript-eslint");'}
${isESM ? 'import angular from "angular-eslint";' : 'const angular = require("angular-eslint");'}

${isESM ? 'export default' : 'module.exports ='} defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: ${prefix
        ? `{
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "${prefix}",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "${prefix}",
          style: "kebab-case",
        },
      ],
    }`
        : '{}'},
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
`;
}
function createProjectESLintConfig(projectRoot, projectType, prefix, setParserOptionsProject, hasE2e) {
    return {
        extends: `${offsetFromRoot(projectRoot)}.eslintrc.json`,
        ignorePatterns: ['!**/*'],
        overrides: [
            {
                files: ['*.ts'],
                ...(setParserOptionsProject
                    ? {
                        parserOptions: {
                            project: setESLintProjectBasedOnProjectType(projectRoot, projectType, hasE2e),
                        },
                    }
                    : null),
                rules: {
                    '@angular-eslint/directive-selector': [
                        'error',
                        { type: 'attribute', prefix, style: 'camelCase' },
                    ],
                    '@angular-eslint/component-selector': [
                        'error',
                        { type: 'element', prefix, style: 'kebab-case' },
                    ],
                },
            },
            {
                files: ['*.html'],
                rules: {},
            },
        ],
    };
}
function createStringifiedProjectESLintConfig(projectRoot, projectType, prefix, setParserOptionsProject, hasE2e, isESM, rootConfigPath) {
    const relativeRootConfigPath = offsetFromRoot(projectRoot) + rootConfigPath;
    return `// @ts-check
${isESM ? 'import { defineConfig } from "eslint/config";' : 'const { defineConfig } = require("eslint/config");'}
${isESM ? `import rootConfig from "${relativeRootConfigPath}";` : `const rootConfig = require("${relativeRootConfigPath}");`}

${isESM ? 'export default' : 'module.exports ='} defineConfig([
  ...rootConfig,
  {
    files: ["**/*.ts"],${setParserOptionsProject
        ? `
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },`
        : ''}
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "${prefix}",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "${prefix}",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
]);
`;
}
function createESLintConfigForProject(projectName, setParserOptionsProject) {
    return (tree) => {
        const angularJSON = readJsonInTree(tree, 'angular.json');
        const { root: projectRoot, projectType, prefix, } = angularJSON.projects[projectName];
        const hasE2e = determineTargetProjectHasE2E(angularJSON, projectName);
        const useFlatConfig = shouldUseFlatConfig(tree);
        const alreadyHasRootFlatConfig = exports.supportedFlatConfigNames.some((name) => tree.exists(name));
        const alreadyHasRootESLintRC = tree.exists('.eslintrc.json');
        /**
         * If the root is an empty string it must be the initial project created at the
         * root by the Angular CLI's workspace schematic
         */
        if (projectRoot === '') {
            return createRootESLintConfigFile(prefix || DEFAULT_PREFIX, useFlatConfig);
        }
        const rules = [];
        // If, for whatever reason, the root eslint.config.js/.eslintrc.json doesn't exist yet, create it
        if (!alreadyHasRootESLintRC && !alreadyHasRootFlatConfig) {
            rules.push(createRootESLintConfigFile(prefix || DEFAULT_PREFIX, useFlatConfig));
        }
        if (useFlatConfig) {
            const rootConfigPath = resolveRootESLintConfigPath(tree) ?? 'eslint.config.js';
            rules.push((tree) => {
                const { isESM, ext } = determineNewProjectESLintConfigContentAndExtension(tree, rootConfigPath, projectRoot);
                return tree.create((0, core_1.join)((0, core_1.normalize)(projectRoot), `eslint.config.${ext}`), createStringifiedProjectESLintConfig(projectRoot, projectType || 'library', prefix || DEFAULT_PREFIX, setParserOptionsProject, hasE2e, isESM, rootConfigPath));
            });
        }
        else {
            rules.push(updateJsonInTree((0, core_1.join)((0, core_1.normalize)(projectRoot), '.eslintrc.json'), () => createProjectESLintConfig(projectRoot, projectType || 'library', prefix || DEFAULT_PREFIX, setParserOptionsProject, hasE2e)));
        }
        return (0, schematics_1.chain)(rules);
    };
}
function createRootESLintConfigFile(prefix, useFlatConfig) {
    return (tree) => {
        if (useFlatConfig) {
            // If the root package.json uses type: module, generate ESM content
            const packageJson = readJsonInTree(tree, 'package.json');
            const isESM = packageJson.type === 'module';
            return tree.create('eslint.config.js', createStringifiedRootESLintConfig(prefix, isESM));
        }
        return updateJsonInTree('.eslintrc.json', () => createRootESLintConfig(prefix));
    };
}
function sortObjectByKeys(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
        return {
            ...result,
            [key]: obj[key],
        };
    }, {});
}
/**
 * To make certain schematic usage conversion more ergonomic, if the user does not specify a project
 * and only has a single project in their angular.json we will just go ahead and use that one.
 */
function determineTargetProjectName(tree, maybeProject) {
    if (maybeProject) {
        return maybeProject;
    }
    const workspaceJson = readJsonInTree(tree, 'angular.json');
    const projects = Object.keys(workspaceJson.projects);
    if (projects.length === 1) {
        return projects[0];
    }
    return null;
}
/**
 * Checking if the target project has e2e setup
 * Method will check if angular project architect has e2e configuration to determine if e2e setup
 */
function determineTargetProjectHasE2E(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
angularJSON, projectName) {
    return !!getTargetsConfigFromProject(angularJSON.projects[projectName])?.e2e;
}
/**
 * See `schematicCollections` docs here:
 * https://github.com/angular/angular-cli/blob/8431b3f0769b5f95b9e13807a09293d820c4b017/docs/specifications/schematic-collections-config.md
 */
function updateSchematicCollections(angularJson, collectionName) {
    angularJson.cli = angularJson.cli || {};
    angularJson.cli.schematicCollections =
        angularJson.cli.schematicCollections || [];
    // The first matching schematic will be used, so we unshift rather than push
    angularJson.cli.schematicCollections.unshift(collectionName);
    // Delete old defaultCollection property if applicable
    delete angularJson.cli.defaultCollection;
    return angularJson;
}
function updateSchematicDefaults(angularJson, schematicFullName, defaultValues) {
    angularJson.schematics = angularJson.schematics || {};
    angularJson.schematics[schematicFullName] =
        angularJson.schematics[schematicFullName] || {};
    angularJson.schematics[schematicFullName] = {
        ...angularJson.schematics[schematicFullName],
        ...defaultValues,
    };
    return angularJson;
}
/**
 * In order to support both flat config and eslintrc we need to dynamically figure out
 * what the user should be using based on:
 * - their existing files
 * - their eslint version
 */
function shouldUseFlatConfig(tree, existingJson) {
    let useFlatConfig = true;
    try {
        const alreadyHasRootFlatConfig = exports.supportedFlatConfigNames.some((name) => tree.exists(name));
        const alreadyHasRootESLintRC = tree.exists('.eslintrc.json');
        if (alreadyHasRootFlatConfig) {
            useFlatConfig = true;
        }
        else if (alreadyHasRootESLintRC) {
            useFlatConfig = false;
        }
        else {
            const json = existingJson ??
                JSON.parse(tree.read('package.json').toString('utf-8'));
            json.devDependencies = json.devDependencies || {};
            const existingESLintVersion = json.devDependencies['eslint'];
            if (existingESLintVersion) {
                const v = semver_1.default.minVersion(existingESLintVersion);
                if (v) {
                    useFlatConfig = semver_1.default.gte(v.raw, '9.0.0');
                }
            }
        }
        return useFlatConfig;
    }
    catch {
        return useFlatConfig;
    }
}
function resolveRootESLintConfigPath(tree) {
    if (tree.exists('.eslintrc.json')) {
        return '.eslintrc.json';
    }
    if (tree.exists('eslint.config.js')) {
        return 'eslint.config.js';
    }
    if (tree.exists('eslint.config.mjs')) {
        return 'eslint.config.mjs';
    }
    if (tree.exists('eslint.config.cjs')) {
        return 'eslint.config.cjs';
    }
    if (tree.exists('eslint.config.ts')) {
        return 'eslint.config.ts';
    }
    if (tree.exists('eslint.config.mts')) {
        return 'eslint.config.mts';
    }
    if (tree.exists('eslint.config.cts')) {
        return 'eslint.config.cts';
    }
    return null;
}
function determineNewProjectESLintConfigContentAndExtension(tree, rootConfigPath, projectRoot) {
    try {
        /**
         * The decision on exactly what config format an extension to use is based on the format
         * used in the root config, and the project's local package.json type (if any).
         */
        const isRootESM = rootConfigPath.endsWith('.cjs')
            ? false
            : rootConfigPath.endsWith('.mjs') ||
                readJsonInTree(tree, 'package.json').type === 'module';
        const projectPackageJsonPath = (0, core_1.join)((0, core_1.normalize)(projectRoot), 'package.json');
        let isESM = isRootESM;
        let ext = 'js';
        if (tree.exists(projectPackageJsonPath)) {
            const projectPackageJson = readJsonInTree(tree, projectPackageJsonPath);
            const isProjectESM = projectPackageJson.type === 'module';
            if (isRootESM && !isProjectESM) {
                ext = 'mjs';
                isESM = true;
            }
            else if (!isRootESM && isProjectESM) {
                ext = 'cjs';
            }
        }
        return {
            isESM,
            ext,
        };
    }
    catch {
        return {
            isESM: false,
            ext: 'js',
        };
    }
}
