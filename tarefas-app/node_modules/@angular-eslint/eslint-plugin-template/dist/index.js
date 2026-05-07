"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const accessibility_json_1 = __importDefault(require("./configs/accessibility.json"));
const all_json_1 = __importDefault(require("./configs/all.json"));
const process_inline_templates_json_1 = __importDefault(require("./configs/process-inline-templates.json"));
const recommended_json_1 = __importDefault(require("./configs/recommended.json"));
const processors_1 = __importDefault(require("./processors"));
const alt_text_1 = __importStar(require("./rules/alt-text"));
const attributes_order_1 = __importStar(require("./rules/attributes-order"));
const banana_in_box_1 = __importStar(require("./rules/banana-in-box"));
const button_has_type_1 = __importStar(require("./rules/button-has-type"));
const click_events_have_key_events_1 = __importStar(require("./rules/click-events-have-key-events"));
const conditional_complexity_1 = __importStar(require("./rules/conditional-complexity"));
const cyclomatic_complexity_1 = __importStar(require("./rules/cyclomatic-complexity"));
const elements_content_1 = __importStar(require("./rules/elements-content"));
const eqeqeq_1 = __importStar(require("./rules/eqeqeq"));
const i18n_1 = __importStar(require("./rules/i18n"));
const interactive_supports_focus_1 = __importStar(require("./rules/interactive-supports-focus"));
const label_has_associated_control_1 = __importStar(require("./rules/label-has-associated-control"));
const mouse_events_have_key_events_1 = __importStar(require("./rules/mouse-events-have-key-events"));
const no_any_1 = __importStar(require("./rules/no-any"));
const no_autofocus_1 = __importStar(require("./rules/no-autofocus"));
const no_call_expression_1 = __importStar(require("./rules/no-call-expression"));
const prefer_built_in_pipes_1 = __importStar(require("./rules/prefer-built-in-pipes"));
const no_distracting_elements_1 = __importStar(require("./rules/no-distracting-elements"));
const no_duplicate_attributes_1 = __importStar(require("./rules/no-duplicate-attributes"));
const no_empty_control_flow_1 = __importStar(require("./rules/no-empty-control-flow"));
const no_inline_styles_1 = __importStar(require("./rules/no-inline-styles"));
const no_interpolation_in_attributes_1 = __importStar(require("./rules/no-interpolation-in-attributes"));
const no_negated_async_1 = __importStar(require("./rules/no-negated-async"));
const no_nested_tags_1 = __importStar(require("./rules/no-nested-tags"));
const no_positive_tabindex_1 = __importStar(require("./rules/no-positive-tabindex"));
const prefer_ngsrc_1 = __importStar(require("./rules/prefer-ngsrc"));
const prefer_at_else_1 = __importStar(require("./rules/prefer-at-else"));
const prefer_at_empty_1 = __importStar(require("./rules/prefer-at-empty"));
const prefer_contextual_for_variables_1 = __importStar(require("./rules/prefer-contextual-for-variables"));
const prefer_control_flow_1 = __importStar(require("./rules/prefer-control-flow"));
const prefer_self_closing_tags_1 = __importStar(require("./rules/prefer-self-closing-tags"));
const prefer_static_string_properties_1 = __importStar(require("./rules/prefer-static-string-properties"));
const prefer_template_literal_1 = __importStar(require("./rules/prefer-template-literal"));
const role_has_required_aria_1 = __importStar(require("./rules/role-has-required-aria"));
const table_scope_1 = __importStar(require("./rules/table-scope"));
const use_track_by_function_1 = __importStar(require("./rules/use-track-by-function"));
const valid_aria_1 = __importStar(require("./rules/valid-aria"));
module.exports = {
    configs: {
        all: all_json_1.default,
        recommended: recommended_json_1.default,
        accessibility: accessibility_json_1.default,
        'process-inline-templates': process_inline_templates_json_1.default,
    },
    processors: processors_1.default,
    rules: {
        [alt_text_1.RULE_NAME]: alt_text_1.default,
        [attributes_order_1.RULE_NAME]: attributes_order_1.default,
        [banana_in_box_1.RULE_NAME]: banana_in_box_1.default,
        [button_has_type_1.RULE_NAME]: button_has_type_1.default,
        [click_events_have_key_events_1.RULE_NAME]: click_events_have_key_events_1.default,
        [conditional_complexity_1.RULE_NAME]: conditional_complexity_1.default,
        [cyclomatic_complexity_1.RULE_NAME]: cyclomatic_complexity_1.default,
        [elements_content_1.RULE_NAME]: elements_content_1.default,
        [eqeqeq_1.RULE_NAME]: eqeqeq_1.default,
        [i18n_1.RULE_NAME]: i18n_1.default,
        [interactive_supports_focus_1.RULE_NAME]: interactive_supports_focus_1.default,
        [label_has_associated_control_1.RULE_NAME]: label_has_associated_control_1.default,
        [mouse_events_have_key_events_1.RULE_NAME]: mouse_events_have_key_events_1.default,
        [no_any_1.RULE_NAME]: no_any_1.default,
        [no_autofocus_1.RULE_NAME]: no_autofocus_1.default,
        [no_call_expression_1.RULE_NAME]: no_call_expression_1.default,
        [prefer_built_in_pipes_1.RULE_NAME]: prefer_built_in_pipes_1.default,
        [no_distracting_elements_1.RULE_NAME]: no_distracting_elements_1.default,
        [no_duplicate_attributes_1.RULE_NAME]: no_duplicate_attributes_1.default,
        [no_empty_control_flow_1.RULE_NAME]: no_empty_control_flow_1.default,
        [no_inline_styles_1.RULE_NAME]: no_inline_styles_1.default,
        [no_interpolation_in_attributes_1.RULE_NAME]: no_interpolation_in_attributes_1.default,
        [no_negated_async_1.RULE_NAME]: no_negated_async_1.default,
        [no_nested_tags_1.RULE_NAME]: no_nested_tags_1.default,
        [no_positive_tabindex_1.RULE_NAME]: no_positive_tabindex_1.default,
        [prefer_at_else_1.RULE_NAME]: prefer_at_else_1.default,
        [prefer_at_empty_1.RULE_NAME]: prefer_at_empty_1.default,
        [prefer_contextual_for_variables_1.RULE_NAME]: prefer_contextual_for_variables_1.default,
        [prefer_control_flow_1.RULE_NAME]: prefer_control_flow_1.default,
        [prefer_ngsrc_1.RULE_NAME]: prefer_ngsrc_1.default,
        [prefer_self_closing_tags_1.RULE_NAME]: prefer_self_closing_tags_1.default,
        [prefer_static_string_properties_1.RULE_NAME]: prefer_static_string_properties_1.default,
        [prefer_template_literal_1.RULE_NAME]: prefer_template_literal_1.default,
        [role_has_required_aria_1.RULE_NAME]: role_has_required_aria_1.default,
        [table_scope_1.RULE_NAME]: table_scope_1.default,
        [use_track_by_function_1.RULE_NAME]: use_track_by_function_1.default,
        [valid_aria_1.RULE_NAME]: valid_aria_1.default,
    },
};
