"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (plugin, parser) => ({
    name: 'angular-eslint/template-base',
    languageOptions: {
        parser,
    },
    plugins: {
        '@angular-eslint/template': plugin,
    },
});
