#!/usr/bin/env node

      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  main
} from "../../chunk-O7GWKY33.js";
import "../../chunk-AFLM6Y4J.js";
import "../../chunk-ALDGUG43.js";
import "../../chunk-65SOG7CU.js";
import "../../chunk-HQICP6JA.js";
import "../../chunk-UQPYSPIX.js";
import {
  NodeJSFileSystem,
  setFileSystem
} from "../../chunk-JBFBFCL7.js";
import "../../chunk-XI2RTGAL.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/bin/ngc.mjs
import "reflect-metadata";
async function runNgcComamnd() {
  process.title = "Angular Compiler (ngc)";
  const args = process.argv.slice(2);
  setFileSystem(new NodeJSFileSystem());
  process.exitCode = main(args, void 0, void 0, void 0, void 0, void 0);
}
runNgcComamnd().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=ngc.js.map
