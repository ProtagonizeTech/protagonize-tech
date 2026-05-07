"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (plugin, parser) => ({
    name: 'angular-eslint/ts-base',
    languageOptions: {
        parser,
        sourceType: 'module',
    },
    plugins: {
        '@angular-eslint': plugin,
    },
});
