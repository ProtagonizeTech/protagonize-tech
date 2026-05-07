"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicableConfig = exports.normalizeOptionsToConfigs = exports.isMultipleConfigOption = exports.checkSelector = exports.checkValidOptions = exports.getActualSelectorType = exports.parseSelectorNode = exports.reportTypeError = exports.reportStyleAndPrefixError = exports.reportStyleError = exports.reportSelectorAfterPrefixError = exports.reportPrefixError = exports.SelectorValidator = exports.OPTION_TYPE_ELEMENT = exports.OPTION_TYPE_ATTRS = exports.OPTION_TYPE_ATTRIBUTE = void 0;
const bundled_angular_compiler_1 = require("@angular-eslint/bundled-angular-compiler");
const ast_utils_1 = require("./ast-utils");
const utils_1 = require("../utils");
exports.OPTION_TYPE_ATTRIBUTE = 'attribute';
exports.OPTION_TYPE_ATTRS = 'attrs';
exports.OPTION_TYPE_ELEMENT = 'element';
const SELECTOR_TYPE_MAPPER = {
    [exports.OPTION_TYPE_ATTRIBUTE]: exports.OPTION_TYPE_ATTRS,
    [exports.OPTION_TYPE_ELEMENT]: exports.OPTION_TYPE_ELEMENT,
};
exports.SelectorValidator = {
    attribute(selector) {
        return selector.length !== 0;
    },
    camelCase(selector) {
        return /^[a-zA-Z0-9[\]]+$/.test(selector);
    },
    element(selector) {
        return selector !== null;
    },
    kebabCase(selector) {
        return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(selector);
    },
    prefixRegex(prefix) {
        return new RegExp(`^\\[?(${prefix})`);
    },
    prefix(prefix, selectorStyle) {
        const regex = this.prefixRegex(prefix);
        return (selector) => {
            if (!prefix)
                return true;
            if (!regex.test(selector))
                return false;
            const selectorAfterPrefix = selector.replace(regex, '');
            if (selectorStyle === ast_utils_1.OPTION_STYLE_CAMEL_CASE) {
                return (!selectorAfterPrefix ||
                    selectorAfterPrefix[0] === selectorAfterPrefix[0].toUpperCase());
            }
            else if (selectorStyle === ast_utils_1.OPTION_STYLE_KEBAB_CASE) {
                return !selectorAfterPrefix || selectorAfterPrefix[0] === '-';
            }
            throw Error('Invalid selector style!');
        };
    },
    selectorAfterPrefix(prefix) {
        const regex = this.prefixRegex(prefix);
        return (selector) => {
            const selectorAfterPrefix = selector.replace(regex, '');
            return Boolean(selectorAfterPrefix);
        };
    },
};
const getValidSelectors = (selectors, types) => {
    return selectors.reduce((previousValue, currentValue) => {
        const validSelectors = types.reduce((accumulator, type) => {
            const value = currentValue[type];
            return value ? accumulator.concat(value) : accumulator;
        }, []);
        return previousValue.concat(validSelectors);
    }, []);
};
const reportPrefixError = (node, prefix, context) => {
    const prefixArray = prefix ? (0, utils_1.arrayify)(prefix) : [];
    context.report({
        node,
        messageId: 'prefixFailure',
        data: {
            prefix: (0, utils_1.toHumanReadableText)(prefixArray),
        },
    });
};
exports.reportPrefixError = reportPrefixError;
const reportSelectorAfterPrefixError = (node, prefix, context) => {
    const prefixArray = prefix ? (0, utils_1.arrayify)(prefix) : [];
    context.report({
        node,
        messageId: 'selectorAfterPrefixFailure',
        data: {
            prefix: (0, utils_1.toHumanReadableText)(prefixArray),
        },
    });
};
exports.reportSelectorAfterPrefixError = reportSelectorAfterPrefixError;
const reportStyleError = (node, style, context) => {
    context.report({
        node,
        messageId: 'styleFailure',
        data: {
            style,
        },
    });
};
exports.reportStyleError = reportStyleError;
const reportStyleAndPrefixError = (node, style, prefix, context) => {
    const prefixArray = prefix ? (0, utils_1.arrayify)(prefix) : [];
    context.report({
        node,
        messageId: 'styleAndPrefixFailure',
        data: {
            style,
            prefix: (0, utils_1.toHumanReadableText)(prefixArray),
        },
    });
};
exports.reportStyleAndPrefixError = reportStyleAndPrefixError;
const reportTypeError = (node, type, context) => {
    context.report({
        node,
        messageId: 'typeFailure',
        data: {
            type,
        },
    });
};
exports.reportTypeError = reportTypeError;
const parseSelectorNode = (node) => {
    if ((0, ast_utils_1.isLiteral)(node)) {
        return bundled_angular_compiler_1.CssSelector.parse(node.raw);
    }
    else if ((0, ast_utils_1.isTemplateLiteral)(node) && node.quasis[0]) {
        return bundled_angular_compiler_1.CssSelector.parse(node.quasis[0].value.raw);
    }
    return null;
};
exports.parseSelectorNode = parseSelectorNode;
const getActualSelectorType = (node) => {
    const listSelectors = (0, exports.parseSelectorNode)(node);
    if (!listSelectors || listSelectors.length === 0) {
        return null;
    }
    // Check the first selector to determine type
    const firstSelector = listSelectors[0];
    // Attribute selectors have attrs populated (e.g., [appFoo])
    // CssSelector.attrs is an array where each attribute is stored as [name, value]
    if (Array.isArray(firstSelector.attrs) && firstSelector.attrs.length > 0) {
        return exports.OPTION_TYPE_ATTRIBUTE;
    }
    // Element selectors have a non-null, non-empty element (e.g., app-foo)
    if (firstSelector.element != null &&
        firstSelector.element !== '' &&
        firstSelector.element !== '*') {
        return exports.OPTION_TYPE_ELEMENT;
    }
    return null;
};
exports.getActualSelectorType = getActualSelectorType;
const checkValidOptions = (type, prefix, style) => {
    // Get options
    const typeOption = (0, utils_1.arrayify)(type);
    const styleOption = style;
    // Check if options are valid
    const isTypeOptionValid = typeOption.length > 0 &&
        typeOption.every((argument) => [exports.OPTION_TYPE_ELEMENT, exports.OPTION_TYPE_ATTRIBUTE].indexOf(argument) !== -1);
    // Prefix is optional - allow undefined, empty string, or empty array
    // If provided, it should be non-empty
    const isPrefixOptionValid = prefix === undefined ||
        prefix === '' ||
        (Array.isArray(prefix) && prefix.length === 0) ||
        prefix.length > 0;
    const isStyleOptionValid = [ast_utils_1.OPTION_STYLE_CAMEL_CASE, ast_utils_1.OPTION_STYLE_KEBAB_CASE].indexOf(styleOption) !==
        -1;
    return isTypeOptionValid && isPrefixOptionValid && isStyleOptionValid;
};
exports.checkValidOptions = checkValidOptions;
const checkSelector = (node, typeOption, prefixOption, styleOption, parsedSelectors) => {
    // Get valid list of selectors
    const types = (0, utils_1.arrayify)(typeOption || [exports.OPTION_TYPE_ATTRS, exports.OPTION_TYPE_ELEMENT]).reduce((previousValue, currentValue) => previousValue.concat(SELECTOR_TYPE_MAPPER[currentValue]), []);
    const styleValidator = styleOption === ast_utils_1.OPTION_STYLE_KEBAB_CASE
        ? exports.SelectorValidator.kebabCase
        : exports.SelectorValidator.camelCase;
    // Use provided parsed selectors or parse them
    const listSelectors = parsedSelectors ?? (0, exports.parseSelectorNode)(node);
    if (!listSelectors) {
        return null;
    }
    const validSelectors = getValidSelectors(listSelectors, types);
    // If no prefix is required (empty or undefined), consider prefix check as passed
    const prefixArray = prefixOption ? (0, utils_1.arrayify)(prefixOption) : [];
    const hasExpectedPrefix = !prefixOption ||
        prefixArray.length === 0 ||
        validSelectors.some((selector) => prefixArray.some((prefix) => exports.SelectorValidator.prefix(prefix, styleOption)(selector)));
    // Style validation should ONLY check if the selector matches the style pattern
    const hasExpectedStyle = validSelectors.some((selector) => styleValidator(selector));
    const hasExpectedType = validSelectors.length > 0;
    // Only check for selector after prefix if prefix is actually required
    const hasSelectorAfterPrefix = !prefixOption ||
        prefixArray.length === 0 ||
        validSelectors.some((selector) => {
            return prefixArray.some((prefix) => {
                return exports.SelectorValidator.selectorAfterPrefix(prefix)(selector);
            });
        });
    return {
        hasExpectedPrefix,
        hasExpectedType,
        hasExpectedStyle,
        hasSelectorAfterPrefix,
    };
};
exports.checkSelector = checkSelector;
// Type guard for multiple configs
const isMultipleConfigOption = (option) => {
    return (Array.isArray(option) &&
        option.length >= 1 &&
        option.length <= 2 &&
        option.every((config) => typeof config.type === 'string'));
};
exports.isMultipleConfigOption = isMultipleConfigOption;
// Normalize options to a consistent format
const normalizeOptionsToConfigs = (option) => {
    const configByType = new Map();
    if ((0, exports.isMultipleConfigOption)(option)) {
        // Validate no duplicate types
        const types = option.map((config) => config.type);
        if (new Set(types).size !== types.length) {
            throw new Error('Invalid rule config: Each config object in the options array must have a unique "type" property (either "element" or "attribute")');
        }
        // Build lookup map by type
        for (const config of option) {
            configByType.set(config.type, config);
        }
    }
    else {
        // Single config - normalize to map format
        // Handle both single type and array of types
        const types = (0, utils_1.arrayify)(option.type);
        for (const type of types) {
            configByType.set(type, {
                type,
                prefix: option.prefix,
                style: option.style,
            });
        }
    }
    return configByType;
};
exports.normalizeOptionsToConfigs = normalizeOptionsToConfigs;
/**
 * Get the applicable config for a given selector node
 */
const getApplicableConfig = (rawSelectors, configByType) => {
    // For multiple configs, determine the actual selector type
    let applicableConfig = null;
    if (configByType.size > 1) {
        // Multiple configs - need to determine which one applies
        const actualType = (0, exports.getActualSelectorType)(rawSelectors);
        if (!actualType) {
            return null;
        }
        const config = configByType.get(actualType);
        if (!config) {
            // No config defined for this selector type
            return null;
        }
        applicableConfig = config;
    }
    else {
        // Single config or single type extracted from array
        const firstEntry = configByType.entries().next();
        if (!firstEntry.done) {
            applicableConfig = firstEntry.value[1];
        }
    }
    return applicableConfig;
};
exports.getApplicableConfig = getApplicableConfig;
