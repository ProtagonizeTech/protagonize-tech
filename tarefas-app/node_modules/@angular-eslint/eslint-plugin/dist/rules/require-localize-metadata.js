"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_DOCS_EXTENSION = exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const DEFAULT_OPTIONS = {
    requireDescription: false,
    requireMeaning: false,
    requireCustomId: false,
};
const STYLE_GUIDE_LINK = 'https://angular.dev/guide/i18n';
const STYLE_GUIDE_LINK_PREPARE = `${STYLE_GUIDE_LINK}/prepare`;
const STYLE_GUIDE_LINK_METADATA_FOR_TRANSLATION = `${STYLE_GUIDE_LINK_PREPARE}#i18n-metadata-for-translation`;
exports.RULE_NAME = 'require-localize-metadata';
exports.default = (0, create_eslint_rule_1.createESLintRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures that $localize tagged messages contain helpful metadata to aid with translations.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    requireDescription: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.requireDescription,
                    },
                    requireMeaning: {
                        type: 'boolean',
                        default: DEFAULT_OPTIONS.requireMeaning,
                    },
                    requireCustomId: {
                        oneOf: [{ type: 'boolean' }, { type: 'string' }],
                        default: DEFAULT_OPTIONS.requireCustomId,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            requireLocalizeDescription: `$localize tagged messages should contain a description. See more at ${STYLE_GUIDE_LINK_METADATA_FOR_TRANSLATION}`,
            requireLocalizeMeaning: `$localize tagged messages should contain a meaning. See more at ${STYLE_GUIDE_LINK_METADATA_FOR_TRANSLATION}`,
            requireLocalizeCustomId: `$localize tagged messages should contain a custom id{{patternMessage}}. See more at ${STYLE_GUIDE_LINK_METADATA_FOR_TRANSLATION}`,
        },
    },
    defaultOptions: [DEFAULT_OPTIONS],
    create(context, [{ requireDescription, requireMeaning, requireCustomId }]) {
        return {
            TaggedTemplateExpression(taggedTemplateExpression) {
                if ((requireDescription || requireMeaning || requireCustomId) &&
                    utils_1.ASTUtils.isIdentifier(taggedTemplateExpression.tag)) {
                    const identifierName = taggedTemplateExpression.tag.name;
                    const templateElement = taggedTemplateExpression.quasi.quasis[0];
                    if (identifierName === '$localize' && !!templateElement) {
                        const metadata = parseMetadata(templateElement.value.raw.trim());
                        if (requireDescription && !metadata.description) {
                            context.report({
                                loc: templateElement.loc,
                                messageId: 'requireLocalizeDescription',
                            });
                        }
                        if (requireMeaning && !metadata.meaning) {
                            context.report({
                                loc: templateElement.loc,
                                messageId: 'requireLocalizeMeaning',
                            });
                        }
                        if (requireCustomId &&
                            !(metadata.customId &&
                                (typeof requireCustomId === 'string'
                                    ? RegExp(requireCustomId).test(metadata.customId)
                                    : true))) {
                            context.report({
                                loc: templateElement.loc,
                                messageId: 'requireLocalizeCustomId',
                                data: {
                                    patternMessage: typeof requireCustomId === 'string'
                                        ? ` matching the pattern /${requireCustomId}/ on '${metadata.customId}'`
                                        : '',
                                },
                            });
                        }
                    }
                }
            },
        };
    },
});
// see https://github.com/angular/angular/blob/main/packages/localize/src/utils/src/messages.ts#L247
const BLOCK_MARKER = ':';
const MEANING_SEPARATOR = '|';
const ID_SEPARATOR = '@@';
function parseMetadata(rawText) {
    const output = {
        rawText,
        meaning: undefined,
        description: undefined,
        customId: undefined,
    };
    if (rawText.charAt(0) !== BLOCK_MARKER) {
        return output;
    }
    const endOfTheBlock = rawText.lastIndexOf(BLOCK_MARKER);
    if (endOfTheBlock === -1) {
        return output;
    }
    const text = rawText.slice(1, endOfTheBlock);
    const [meaningAndDesc, customId] = text.split(ID_SEPARATOR, 2);
    let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
    if (description === undefined) {
        description = meaning;
        meaning = undefined;
    }
    if (description === '') {
        description = undefined;
    }
    return { rawText, meaning, description, customId };
}
exports.RULE_DOCS_EXTENSION = {
    rationale: `When internationalizing Angular applications with @angular/localize, adding metadata (description, meaning, and custom IDs) to $localize tagged strings is essential for high-quality translations. The description helps translators understand the context and purpose of the text they're translating. For example, "Open" could mean "open a file" (access/view) or "open an account" (establish/create) - context matters for accurate translation. The meaning field distinguishes identical text that needs different translations in different contexts. Custom IDs provide stable references that persist across code changes, preventing retranslation when only code structure changes. Without this metadata, translators work blind, leading to poor translations, wasted effort on retranslating unchanged strings, and difficulty managing large translation projects. This rule ensures your $localize strings include helpful metadata for translation workflows.`,
};
