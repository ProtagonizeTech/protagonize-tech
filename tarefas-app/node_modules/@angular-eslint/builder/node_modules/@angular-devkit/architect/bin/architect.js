#!/usr/bin/env node
"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const node_fs_1 = require("node:fs");
const path = __importStar(require("node:path"));
const node_util_1 = require("node:util");
const index_1 = require("../index");
const index_2 = require("../node/index");
function findUp(names, from) {
    const filenames = Array.isArray(names) ? names : [names];
    let currentDir = path.resolve(from);
    while (true) {
        for (const name of filenames) {
            const p = path.join(currentDir, name);
            if ((0, node_fs_1.existsSync)(p)) {
                return p;
            }
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            break;
        }
        currentDir = parentDir;
    }
    return null;
}
/**
 * Show usage of the CLI tool, and exit the process.
 */
function usage(logger, exitCode = 0) {
    logger.info(core_1.tags.stripIndent `
    architect [project][:target][:configuration] [options, ...]

    Run a project target.
    If project/target/configuration are not specified, the workspace defaults will be used.

    Options:
        --help              Show available options for project target.
                            Shows this message instead when ran without the run argument.


    Any additional option is passed the target, overriding existing options.
  `);
    return process.exit(exitCode);
}
async function _executeTarget(parentLogger, workspace, root, targetStr, options, registry) {
    const architectHost = new index_2.WorkspaceNodeModulesArchitectHost(workspace, root);
    const architect = new index_1.Architect(architectHost, registry);
    // Split a target into its parts.
    const [project, target, configuration] = targetStr.split(':');
    const targetSpec = { project, target, configuration };
    const logger = new core_1.logging.Logger('jobs');
    const logs = [];
    logger.subscribe((entry) => logs.push({ ...entry, message: `${entry.name}: ` + entry.message }));
    const run = await architect.scheduleTarget(targetSpec, options, { logger });
    // Wait for full completion of the builder.
    try {
        const result = await run.lastOutput;
        if (result.success) {
            parentLogger.info((0, node_util_1.styleText)(['green'], 'SUCCESS'));
        }
        else {
            parentLogger.info((0, node_util_1.styleText)(['red'], 'FAILURE'));
        }
        parentLogger.info('Result: ' + JSON.stringify({ ...result, info: undefined }, null, 4));
        parentLogger.info('\nLogs:');
        logs.forEach((l) => parentLogger.next(l));
        logs.splice(0);
        await run.stop();
        return result.success ? 0 : 1;
    }
    catch (err) {
        parentLogger.info((0, node_util_1.styleText)(['red'], 'ERROR'));
        parentLogger.info('\nLogs:');
        logs.forEach((l) => parentLogger.next(l));
        parentLogger.fatal('Exception:');
        parentLogger.fatal((err instanceof Error && err.stack) || `${err}`);
        return 2;
    }
}
const CLI_OPTION_DEFINITIONS = {
    'help': { type: 'boolean' },
    'verbose': { type: 'boolean' },
};
/** Parse the command line. */
function parseOptions(args) {
    const { values, tokens } = (0, node_util_1.parseArgs)({
        args,
        strict: false,
        tokens: true,
        allowPositionals: true,
        allowNegative: true,
        options: CLI_OPTION_DEFINITIONS,
    });
    const builderOptions = {};
    const positionals = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.kind === 'positional') {
            positionals.push(token.value);
            continue;
        }
        if (token.kind !== 'option') {
            continue;
        }
        const name = token.name;
        let value = token.value ?? true;
        // `parseArgs` already handled known boolean args and their --no- forms.
        // Only process options not in CLI_OPTION_DEFINITIONS here.
        if (name in CLI_OPTION_DEFINITIONS) {
            continue;
        }
        if (/[A-Z]/.test(name)) {
            throw new Error(`Unknown argument ${name}. Did you mean ${core_1.strings.decamelize(name).replaceAll('_', '-')}?`);
        }
        // Handle --no-flag for unknown options, treating it as false
        if (name.startsWith('no-')) {
            const realName = name.slice(3);
            builderOptions[core_1.strings.camelize(realName)] = false;
            continue;
        }
        // Handle value for unknown options
        if (token.inlineValue === undefined) {
            // Look ahead
            const nextToken = tokens[i + 1];
            if (nextToken?.kind === 'positional') {
                value = nextToken.value;
                i++; // Consume next token
            }
            else {
                value = true; // Treat as boolean if no value follows
            }
        }
        if (typeof value === 'string') {
            if (!isNaN(Number(value))) {
                // Type inference for numbers
                value = Number(value);
            }
            else if (value === 'true') {
                // Type inference for booleans
                value = true;
            }
            else if (value === 'false') {
                value = false;
            }
        }
        const camelName = core_1.strings.camelize(name);
        if (Object.prototype.hasOwnProperty.call(builderOptions, camelName)) {
            const existing = builderOptions[camelName];
            if (Array.isArray(existing)) {
                existing.push(value);
            }
            else {
                builderOptions[camelName] = [existing, value];
            }
        }
        else {
            builderOptions[camelName] = value;
        }
    }
    return {
        positionals,
        builderOptions,
        cliOptions: values,
    };
}
async function main(args) {
    /** Parse the command line. */
    const { positionals, cliOptions, builderOptions } = parseOptions(args);
    /** Create the DevKit Logger used through the CLI. */
    const logger = (0, node_1.createConsoleLogger)(!!cliOptions['verbose'], process.stdout, process.stderr, {
        info: (s) => s,
        debug: (s) => s,
        warn: (s) => (0, node_util_1.styleText)(['yellow', 'bold'], s),
        error: (s) => (0, node_util_1.styleText)(['red', 'bold'], s),
        fatal: (s) => (0, node_util_1.styleText)(['red', 'bold'], s),
    });
    // Check the target.
    const targetStr = positionals[0];
    if (!targetStr || cliOptions.help) {
        // Show architect usage if there's no target.
        usage(logger);
    }
    // Load workspace configuration file.
    const currentPath = process.cwd();
    const configFileNames = ['angular.json', '.angular.json', 'workspace.json', '.workspace.json'];
    const configFilePath = findUp(configFileNames, currentPath);
    if (!configFilePath) {
        logger.fatal(`Workspace configuration file (${configFileNames.join(', ')}) cannot be found in ` +
            `'${currentPath}' or in parent directories.`);
        return 3;
    }
    const root = path.dirname(configFilePath);
    const registry = new core_1.schema.CoreSchemaRegistry();
    registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
    // Show usage of deprecated options
    registry.useXDeprecatedProvider((msg) => logger.warn(msg));
    const { workspace } = await core_1.workspaces.readWorkspace(configFilePath, core_1.workspaces.createWorkspaceHost(new node_1.NodeJsSyncHost()));
    // Clear the console.
    process.stdout.write('\u001Bc');
    return await _executeTarget(logger, workspace, root, targetStr, builderOptions, registry);
}
main(process.argv.slice(2)).then((code) => {
    process.exit(code);
}, (err) => {
    // eslint-disable-next-line no-console
    console.error('Error: ' + err.stack || err.message || err);
    process.exit(-1);
});
//# sourceMappingURL=architect.js.map