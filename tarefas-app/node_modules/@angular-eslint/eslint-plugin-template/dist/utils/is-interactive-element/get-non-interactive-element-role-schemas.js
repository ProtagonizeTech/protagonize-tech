"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonInteractiveElementRoleSchemas = getNonInteractiveElementRoleSchemas;
exports.getNonInteractiveRoles = getNonInteractiveRoles;
const aria_query_1 = require("aria-query");
let nonInteractiveElementRoleSchemas = null;
let nonInteractiveRoles = null;
// These functions follow the lazy initialization pattern.
// Since this is a top-level module (it will be included via `require`),
// we do not need to initialize the `nonInteractiveElementRoleSchemas` or
// `nonInteractiveRoles` until the functions are called for the first time,
// so we will not take up the memory.
function getNonInteractiveElementRoleSchemas() {
    if (nonInteractiveElementRoleSchemas === null) {
        const elementRoleEntries = [...aria_query_1.elementRoles.entries()];
        nonInteractiveElementRoleSchemas = elementRoleEntries.reduce((accumulator, [elementSchema, roleSet]) => {
            return accumulator.concat([...roleSet].every((role) => getNonInteractiveRoles().has(role))
                ? elementSchema
                : []);
        }, []);
    }
    return nonInteractiveElementRoleSchemas;
}
function getNonInteractiveRoles() {
    if (nonInteractiveRoles === null) {
        const roleKeys = [...aria_query_1.roles.keys()];
        nonInteractiveRoles = new Set(roleKeys
            .filter((name) => {
            const role = aria_query_1.roles.get(name);
            return (role &&
                !role.abstract &&
                // 'toolbar' does not descend from widget, but it does support
                // aria-activedescendant, thus in practice we treat it as a widget.
                name !== 'toolbar' &&
                !role.superClass.some((classes) => classes.includes('widget')));
        })
            .concat(
        // The `progressbar` is descended from `widget`, but in practice, its
        // value is always `readonly`, so we treat it as a non-interactive role.
        'progressbar'));
    }
    return nonInteractiveRoles;
}
