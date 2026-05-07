"use strict";
/**
 * In order to prevent the project graph cache from showing up at the root of the user's
 * workspace, we set a custom cache directory before importing anything from `@nx/devkit`.
 *
 * `no-restricted-imports` eslint rule has been configured for this project to prevent
 * accidental imports in other files. All imports should come from here to ensure consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAngularDevkitSchematic = exports.writeJson = exports.readJson = exports.offsetFromRoot = exports.convertNxGenerator = void 0;
const node_path_1 = require("node:path");
process.env.NX_PROJECT_GRAPH_CACHE_DIRECTORY = (0, node_path_1.join)(__dirname, '..', '.nx-cache');
var devkit_1 = require("@nx/devkit");
Object.defineProperty(exports, "convertNxGenerator", { enumerable: true, get: function () { return devkit_1.convertNxGenerator; } });
Object.defineProperty(exports, "offsetFromRoot", { enumerable: true, get: function () { return devkit_1.offsetFromRoot; } });
Object.defineProperty(exports, "readJson", { enumerable: true, get: function () { return devkit_1.readJson; } });
Object.defineProperty(exports, "writeJson", { enumerable: true, get: function () { return devkit_1.writeJson; } });
var ngcli_adapter_1 = require("@nx/devkit/ngcli-adapter");
Object.defineProperty(exports, "wrapAngularDevkitSchematic", { enumerable: true, get: function () { return ngcli_adapter_1.wrapAngularDevkitSchematic; } });
