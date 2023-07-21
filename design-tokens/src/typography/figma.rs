use std::collections::BTreeMap;

use super::{input, output, scalars};
use crate::prelude::*;

pub mod figma_scalars {
    use crate::prelude::*;

    /// This must have the same name as the [crate::typography::scalars::FontStyleRule].
    /// TODO: Perhaps we can make it so the multiple scalars can be combined somehow
    /// like if there is another scalar for css::css_scalars.
    ///
    /// Another way to think of this is the "Figma-specific" settings.
    #[derive(Codegen, Deserialize)]
    #[codegen(tags = "figma-typography-scalar")]
    // ts_interface_merge: so it can be combined with other specified scalars (WIP 0/10: maybe not very nice for other languages...)
    #[codegen(ts_interface_merge)]
    #[allow(non_snake_case)]
    pub struct FontStyleRule {
        #[serde(alias = "figma")]
        pub Figma: FigmaFontStyleRule,
    }

    // should this just be something like file distributable name?
    /// String that follows the base name of the family.
    /// This is used for your design programs like Figma.
    /// e.g. `" Italic"` for italics of Inter or Source Serif
    /// e.g. `" Thin"` for W100, `" Light"` for W300, `" Medium"` for W500, `" Bold"` for W700, etc.
    #[derive(Codegen, Clone, Debug, Serialize, Deserialize)]
    #[codegen(tags = "figma-typography-scalar")]
    #[allow(non_snake_case)]
    pub enum FigmaFontStyleRule {
        /// Suffix plus order number
        FontSuffix(String, usize),
        /// See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
        /// e.g. `"'wght' 50"`
        FontVariation(String, String),
    }
}

pub mod figma_export {
    use std::collections::BTreeMap;

    use crate::{
        prelude::*,
        tokens::{split_tokens, Token, TokenSet},
        typography::output::{TokenLookup, TokenQueryOutput, TypographyProperty},
    };
    use derive_codegen::Codegen;

    use super::{figma_config, figma_scalars};

    #[derive(Codegen, Serialize)]
    #[codegen(tags = "figma-typography-export")]
    pub struct FigmaPluginCommand {
        figma_plugin: FigmaPluginCommandOperation,
    }

    #[derive(Codegen, Serialize)]
    #[codegen(tags = "figma-typography-export")]
    pub enum FigmaPluginCommandOperation {
        UpdateTypography { text_styles: Vec<TextStyle> },
    }

    #[derive(Debug, Codegen, Serialize)]
    #[codegen(tags = "figma-typography-export")]
    pub struct TextStyle {
        pub name: String,
        /// Used to figure out which Figma TextStyles to replace.
        pub key: String,
        pub family_name_and_style: (String, String),
        pub font_size_px: f64,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub line_height_px: Option<f64>,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub letter_spacing_px: Option<f64>,
        #[serde(skip_serializing_if = "Vec::is_empty")]
        pub variant_values: Vec<(String, String)>,
    }

    impl TextStyle {
        /// I'm not sure if this is something we should really do on the Rust side.
        /// Maybe Figma files will have their own custom TextStyles with on-demand tokenization ?
        pub fn try_from_lookup<'a>(
            name: String,
            key: String,
            lookup_output: TokenQueryOutput<'a>,
        ) -> Result<Self> {
            // collected with precedents
            let mut family_name_found = Option::<Cow<'a, str>>::None;
            let mut family_style_prec: BTreeMap<isize, String> = BTreeMap::new();
            let mut line_height_px = Option::<f64>::None;
            let mut letter_spacing_px = Option::<f64>::None;
            let mut line_height_px = Option::<f64>::None;
            let mut font_size_px = 16f64;
            let mut variant_values: Vec<(String, String)> = Vec::new();
            for prop in lookup_output.properties {
                match prop {
                    TypographyProperty::FontFamily { family_name } => {
                        family_name_found = Some(family_name.clone());
                    }
                    TypographyProperty::LineHeight { px } => line_height_px = Some(*px),
                    TypographyProperty::FontSize { px } => font_size_px = *px,
                    TypographyProperty::LetterSpacing { px } => letter_spacing_px = Some(*px),
                    TypographyProperty::FontStyle(style_scalar) => {
                        let figma_font_style_rule =
                            serde_json::from_value::<figma_scalars::FontStyleRule>(
                                style_scalar.0.clone(),
                            )
                            .with_context(|| {
                                format!(
                                "expecting TypographyProperty::FontStyle to support Figma plugin"
                            )
                            })?
                            .Figma;

                        match figma_font_style_rule {
                            figma_scalars::FigmaFontStyleRule::FontSuffix(name, prec) => {
                                family_style_prec.insert(prec as isize, name);
                            }
                            figma_scalars::FigmaFontStyleRule::FontVariation(key, value) => {
                                variant_values.push((key, value))
                            }
                        }
                    }
                }
            }

            Ok(TextStyle {
                name,
                key,
                // using a btree map to ensure the keys are ordered
                family_name_and_style: (
                    family_name_found
                        .ok_or_else(|| anyhow::anyhow!("no family name found for text style"))?
                        .to_string(),
                    family_style_prec
                        .into_values()
                        .collect::<String>()
                        .trim()
                        .to_string(),
                ),
                font_size_px,
                line_height_px,
                letter_spacing_px,
                variant_values,
            })
        }
    }

    #[derive(Clone)]
    struct TokenSelection {
        name: String,
        key: TokenSet,
        tokens: TokenSet,
    }

    pub fn update_typography_for_figma(
        all_tokens: &crate::typography::output::TypographyExport,
        extension_input: &figma_config::TypographyExtensionInput,
    ) -> Result<FigmaPluginCommand> {
        let lookup = all_tokens.as_lookup();
        let mut figma_text_styles = Vec::<TextStyle>::new();

        for text_style in &extension_input.Figma.FigmaTextStyles {
            let mut collected = {
                let mut init = Vec::<TokenSelection>::new();
                let mut starter_tokens =
                    split_tokens(&text_style.BaseTokens).with_context(|| {
                        format!(
                            "while reading your Figma text style ({:?})",
                            text_style.BaseName
                        )
                    })?;
                starter_tokens.insert(0, Token::Kind("text".into()));
                init.push(TokenSelection {
                    name: text_style.BaseName.clone(),
                    tokens: TokenSet::from(starter_tokens),
                    key: TokenSet::from([key_token(&text_style.BaseKey)]),
                });
                init
            };

            for group in &text_style.Groups {
                let original_text_styles = collected.clone();
                let group_prefix = group
                    .NamePrefix
                    .as_ref()
                    .map(String::as_str)
                    .unwrap_or(" / ");
                let group_suffix = group.NameSuffix.as_ref().map(String::as_str).unwrap_or("");

                collected.clear();
                for original in &original_text_styles {
                    if group.IncludeEmptyOption.unwrap_or(false) {
                        let mut empty_option = original.clone();
                        let needs_empty_name = if let Some(ref prefix) = group.NamePrefix {
                            // only if the prefix attempts to establish another folder
                            // otehrwise this name will conflict with a folder.
                            prefix.trim_end().ends_with("/")
                        } else {
                            true
                        };

                        if needs_empty_name {
                            empty_option.name += group
                                .NamePrefix
                                .as_ref()
                                .map(|a| a.as_str())
                                .unwrap_or(" / ");
                            empty_option.name += "<base>";
                            if let Some(ref suffix) = group.NameSuffix {
                                empty_option.name += suffix;
                            }
                        }

                        collected.push(empty_option);
                    }
                    for option in &group.Options {
                        let mut new_name = format!(
                            "{}{group_prefix}{}{group_suffix}",
                            original.name, option.Name
                        );
                        let option_tokens = split_tokens(&option.Tokens).with_context(|| {
                            format!(
                                "while reading a group option ({:?}) for your Figma text style ({:?})",
                                option.Name,
                                text_style.BaseName
                            )
                        })?;
                        let mut new_key = original.key.clone();
                        if let Some(key) = &option.Key {
                            new_key
                                .insert(Token::Value(format!("key-{key}").into(), "true".into()));
                        } else {
                            new_key.append(option_tokens.clone());
                        }
                        let mut new_tokens = original.tokens.clone();
                        new_tokens.append(option_tokens);
                        collected.push(TokenSelection {
                            name: new_name,
                            key: new_key,
                            tokens: new_tokens,
                        });
                    }
                }
            }

            for TokenSelection { name, key, tokens } in &collected {
                let lookup_output = lookup.query_with_set(&tokens);

                let key_str = key
                    .iter()
                    .map(|v| v.to_string())
                    .collect::<Vec<_>>()
                    .join(" ");

                figma_text_styles.push(
                    TextStyle::try_from_lookup(name.clone(), key_str, lookup_output).with_context(
                        || {
                            format!(
                                "failed to create text style {name:?} ({key:?}) with query ({tokens:?})\n\n{all_tokens:#?}"
                            )
                        },
                    )?,
                );
            }
        }

        Ok(FigmaPluginCommand {
            figma_plugin: FigmaPluginCommandOperation::UpdateTypography {
                text_styles: figma_text_styles,
            },
        })
    }

    fn key_token(key: &str) -> Token {
        Token::Value(format!("key-{key}").into(), Cow::Borrowed("true"))
    }
}

pub mod figma_config {
    use crate::prelude::*;

    // Must be named `TypographyExtensionInput` to ensure it merges with other typography extensions
    #[derive(Debug, Codegen, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[codegen(ts_interface_merge)]
    #[allow(non_snake_case)]
    pub struct TypographyExtensionInput {
        #[serde(alias = "figma")]
        pub Figma: FigmaTypographyConfig,
    }

    #[derive(Codegen, Debug, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[allow(non_snake_case)]
    pub struct FigmaTypographyConfig {
        // TODO: Some kind of narrowing / selections for creating types / lints for the design system
        // e.g. we should be able to swap the font families, even if the new one has fewer weights.
        /// A sort of matrice of all possible combinations of the variants
        pub FigmaTextStyles: Vec<FigmaTextStyle>,
    }

    #[derive(Codegen, Debug, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[allow(non_snake_case)]
    pub struct FigmaTextStyle {
        pub BaseName: String,
        pub BaseTokens: String,
        pub BaseKey: String,
        pub Description: Option<String>,
        pub Groups: Vec<FigmaTextStyleMatrixGroup>,
    }

    #[derive(Codegen, Debug, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[allow(non_snake_case)]
    pub struct FigmaTextStyleMatrixGroup {
        /// Defaults to `" / "` for groups to create folders.
        /// Use something like `" "` to create join with the previous group like "Regular Italic" from "Regular" & "Italic" groups.
        pub NamePrefix: Option<String>,
        /// Defaults to `""`, but can be useful for stylizing your name groups
        pub NameSuffix: Option<String>,
        /// When the name is empty, then don't apply the name prefix and name suffix.
        pub IncludeEmptyOption: Option<bool>,
        pub Description: Option<String>,
        pub Options: Vec<FigmaTextStyleMatrixOption>,
    }

    #[derive(Codegen, Debug, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[allow(non_snake_case)]
    pub struct FigmaTextStyleMatrixOption {
        pub Name: String,
        pub Tokens: String,
        /// Specify a key when the tokens are used as a "group" with semantic meaning.
        /// This will ensure that even if the Tokens change, that the options will update correctly.
        pub Key: Option<String>,
        pub Description: Option<String>,
    }
}
