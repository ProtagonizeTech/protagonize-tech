/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ApplicationRef, Type } from '@angular/core';
import { BootstrapContext } from '@angular/platform-browser';
interface RouterResult {
    route: string;
    success: boolean;
    redirect: boolean;
}
export declare function extractRoutes(bootstrapAppFnOrModule: ((context: BootstrapContext) => Promise<ApplicationRef>) | Type<unknown>, document: string): AsyncIterableIterator<RouterResult>;
export {};
