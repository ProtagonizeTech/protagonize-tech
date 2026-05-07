"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInteractiveElementRoleSchemas = getInteractiveElementRoleSchemas;
const aria_query_1 = require("aria-query");
let interactiveElementRoleSchemas = null;
// This function follows the lazy initialization pattern.
// Since this is a top-level module (it will be included via `require`), we do not need to
// initialize the `interactiveElementRoleSchemas` until the function is called
// for the first time, so we will not take up the memory.
function getInteractiveElementRoleSchemas() {
    if (interactiveElementRoleSchemas === null) {
        const roleKeys = [...aria_query_1.roles.keys()];
        const elementRoleEntries = [...aria_query_1.elementRoles.entries()];
        // This set will contain all possible values for the `role` attribute,
        // e.g. `button`, `navigation` or `presentation`.
        const interactiveRoles = new Set(roleKeys
            .filter((name) => {
            const role = aria_query_1.roles.get(name);
            return (role &&
                !role.abstract &&
                // The `progressbar` is descended from `widget`, but in practice, its
                // value is always `readonly`, so we treat it as a non-interactive role.
                name !== 'progressbar' &&
                role.superClass.some((classes) => classes.includes('widget')));
        })
            .concat(
        // 'toolbar' does not descend from widget, but it does support
        // aria-activedescendant, thus in practice we treat it as a widget.
        'toolbar'));
        interactiveElementRoleSchemas = elementRoleEntries.reduce((accumulator, [elementSchema, roleSet]) => {
            return accumulator.concat([...roleSet].every((role) => interactiveRoles.has(role))
                ? elementSchema
                : []);
        }, []);
    }
    return interactiveElementRoleSchemas;
}
