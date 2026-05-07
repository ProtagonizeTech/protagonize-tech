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
const all_json_1 = __importDefault(require("./configs/all.json"));
const recommended_json_1 = __importDefault(require("./configs/recommended.json"));
const component_class_suffix_1 = __importStar(require("./rules/component-class-suffix"));
const component_max_inline_declarations_1 = __importStar(require("./rules/component-max-inline-declarations"));
const component_selector_1 = __importStar(require("./rules/component-selector"));
const consistent_component_styles_1 = __importStar(require("./rules/consistent-component-styles"));
const contextual_decorator_1 = __importStar(require("./rules/contextual-decorator"));
const contextual_lifecycle_1 = __importStar(require("./rules/contextual-lifecycle"));
const directive_class_suffix_1 = __importStar(require("./rules/directive-class-suffix"));
const directive_selector_1 = __importStar(require("./rules/directive-selector"));
const no_async_lifecycle_method_1 = __importStar(require("./rules/no-async-lifecycle-method"));
const no_attribute_decorator_1 = __importStar(require("./rules/no-attribute-decorator"));
const no_conflicting_lifecycle_1 = __importStar(require("./rules/no-conflicting-lifecycle"));
const no_duplicates_in_metadata_arrays_1 = __importStar(require("./rules/no-duplicates-in-metadata-arrays"));
const no_empty_lifecycle_method_1 = __importStar(require("./rules/no-empty-lifecycle-method"));
const no_forward_ref_1 = __importStar(require("./rules/no-forward-ref"));
const no_input_prefix_1 = __importStar(require("./rules/no-input-prefix"));
const no_input_rename_1 = __importStar(require("./rules/no-input-rename"));
const no_inputs_metadata_property_1 = __importStar(require("./rules/no-inputs-metadata-property"));
const no_lifecycle_call_1 = __importStar(require("./rules/no-lifecycle-call"));
const no_output_native_1 = __importStar(require("./rules/no-output-native"));
const no_output_on_prefix_1 = __importStar(require("./rules/no-output-on-prefix"));
const no_output_rename_1 = __importStar(require("./rules/no-output-rename"));
const no_outputs_metadata_property_1 = __importStar(require("./rules/no-outputs-metadata-property"));
const no_pipe_impure_1 = __importStar(require("./rules/no-pipe-impure"));
const no_queries_metadata_property_1 = __importStar(require("./rules/no-queries-metadata-property"));
const no_uncalled_signals_1 = __importStar(require("./rules/no-uncalled-signals"));
const pipe_prefix_1 = __importStar(require("./rules/pipe-prefix"));
const prefer_host_metadata_property_1 = __importStar(require("./rules/prefer-host-metadata-property"));
const prefer_on_push_component_change_detection_1 = __importStar(require("./rules/prefer-on-push-component-change-detection"));
const prefer_output_emitter_ref_1 = __importStar(require("./rules/prefer-output-emitter-ref"));
const prefer_output_readonly_1 = __importStar(require("./rules/prefer-output-readonly"));
const prefer_inject_1 = __importStar(require("./rules/prefer-inject"));
const prefer_signals_1 = __importStar(require("./rules/prefer-signals"));
const prefer_standalone_1 = __importStar(require("./rules/prefer-standalone"));
const relative_url_prefix_1 = __importStar(require("./rules/relative-url-prefix"));
const require_lifecycle_on_prototype_1 = __importStar(require("./rules/require-lifecycle-on-prototype"));
const require_localize_metadata_1 = __importStar(require("./rules/require-localize-metadata"));
const runtime_localize_1 = __importStar(require("./rules/runtime-localize"));
const sort_keys_in_type_decorator_1 = __importStar(require("./rules/sort-keys-in-type-decorator"));
const sort_lifecycle_methods_1 = __importStar(require("./rules/sort-lifecycle-methods"));
const use_component_selector_1 = __importStar(require("./rules/use-component-selector"));
const use_component_view_encapsulation_1 = __importStar(require("./rules/use-component-view-encapsulation"));
const use_injectable_provided_in_1 = __importStar(require("./rules/use-injectable-provided-in"));
const use_lifecycle_interface_1 = __importStar(require("./rules/use-lifecycle-interface"));
const use_pipe_transform_interface_1 = __importStar(require("./rules/use-pipe-transform-interface"));
const no_experimental_1 = __importStar(require("./rules/no-experimental"));
const no_developer_preview_1 = __importStar(require("./rules/no-developer-preview"));
module.exports = {
    configs: {
        all: all_json_1.default,
        recommended: recommended_json_1.default,
    },
    rules: {
        [component_class_suffix_1.RULE_NAME]: component_class_suffix_1.default,
        [component_max_inline_declarations_1.RULE_NAME]: component_max_inline_declarations_1.default,
        [component_selector_1.RULE_NAME]: component_selector_1.default,
        [consistent_component_styles_1.RULE_NAME]: consistent_component_styles_1.default,
        [contextual_decorator_1.RULE_NAME]: contextual_decorator_1.default,
        [contextual_lifecycle_1.RULE_NAME]: contextual_lifecycle_1.default,
        [directive_class_suffix_1.RULE_NAME]: directive_class_suffix_1.default,
        [directive_selector_1.RULE_NAME]: directive_selector_1.default,
        [no_async_lifecycle_method_1.RULE_NAME]: no_async_lifecycle_method_1.default,
        [no_attribute_decorator_1.RULE_NAME]: no_attribute_decorator_1.default,
        [no_conflicting_lifecycle_1.RULE_NAME]: no_conflicting_lifecycle_1.default,
        [no_duplicates_in_metadata_arrays_1.RULE_NAME]: no_duplicates_in_metadata_arrays_1.default,
        [no_empty_lifecycle_method_1.RULE_NAME]: no_empty_lifecycle_method_1.default,
        [no_forward_ref_1.RULE_NAME]: no_forward_ref_1.default,
        [no_input_prefix_1.RULE_NAME]: no_input_prefix_1.default,
        [no_input_rename_1.RULE_NAME]: no_input_rename_1.default,
        [no_inputs_metadata_property_1.RULE_NAME]: no_inputs_metadata_property_1.default,
        [no_lifecycle_call_1.RULE_NAME]: no_lifecycle_call_1.default,
        [no_uncalled_signals_1.RULE_NAME]: no_uncalled_signals_1.default,
        [no_output_native_1.RULE_NAME]: no_output_native_1.default,
        [no_output_on_prefix_1.RULE_NAME]: no_output_on_prefix_1.default,
        [no_output_rename_1.RULE_NAME]: no_output_rename_1.default,
        [no_outputs_metadata_property_1.RULE_NAME]: no_outputs_metadata_property_1.default,
        [no_pipe_impure_1.RULE_NAME]: no_pipe_impure_1.default,
        [no_queries_metadata_property_1.RULE_NAME]: no_queries_metadata_property_1.default,
        [pipe_prefix_1.RULE_NAME]: pipe_prefix_1.default,
        [prefer_host_metadata_property_1.RULE_NAME]: prefer_host_metadata_property_1.default,
        [prefer_on_push_component_change_detection_1.RULE_NAME]: prefer_on_push_component_change_detection_1.default,
        [prefer_signals_1.RULE_NAME]: prefer_signals_1.default,
        [prefer_standalone_1.RULE_NAME]: prefer_standalone_1.default,
        [prefer_inject_1.RULE_NAME]: prefer_inject_1.default,
        [prefer_output_emitter_ref_1.RULE_NAME]: prefer_output_emitter_ref_1.default,
        [prefer_output_readonly_1.RULE_NAME]: prefer_output_readonly_1.default,
        [relative_url_prefix_1.RULE_NAME]: relative_url_prefix_1.default,
        [require_lifecycle_on_prototype_1.RULE_NAME]: require_lifecycle_on_prototype_1.default,
        [require_localize_metadata_1.RULE_NAME]: require_localize_metadata_1.default,
        [runtime_localize_1.RULE_NAME]: runtime_localize_1.default,
        [sort_keys_in_type_decorator_1.RULE_NAME]: sort_keys_in_type_decorator_1.default,
        [sort_lifecycle_methods_1.RULE_NAME]: sort_lifecycle_methods_1.default,
        [use_component_selector_1.RULE_NAME]: use_component_selector_1.default,
        [use_component_view_encapsulation_1.RULE_NAME]: use_component_view_encapsulation_1.default,
        [use_injectable_provided_in_1.RULE_NAME]: use_injectable_provided_in_1.default,
        [use_lifecycle_interface_1.RULE_NAME]: use_lifecycle_interface_1.default,
        [use_pipe_transform_interface_1.RULE_NAME]: use_pipe_transform_interface_1.default,
        [no_experimental_1.RULE_NAME]: no_experimental_1.default,
        [no_developer_preview_1.RULE_NAME]: no_developer_preview_1.default,
    },
};
