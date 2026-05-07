"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltinTaskExecutor = void 0;
const executor_1 = __importDefault(require("../package-manager/executor"));
const options_1 = require("../package-manager/options");
const executor_2 = __importDefault(require("../repo-init/executor"));
const options_2 = require("../repo-init/options");
const executor_3 = __importDefault(require("../run-schematic/executor"));
const options_3 = require("../run-schematic/options");
class BuiltinTaskExecutor {
    static NodePackage = {
        name: options_1.NodePackageName,
        create: async (options) => (0, executor_1.default)(options),
    };
    static RepositoryInitializer = {
        name: options_2.RepositoryInitializerName,
        create: async (options) => (0, executor_2.default)(options),
    };
    static RunSchematic = {
        name: options_3.RunSchematicName,
        create: async () => (0, executor_3.default)(),
    };
}
exports.BuiltinTaskExecutor = BuiltinTaskExecutor;
//# sourceMappingURL=index.js.map