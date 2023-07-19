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
        pub family_name: String,
        pub font_size_px: f64,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub line_height_px: Option<f64>,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub letter_spacing_px: Option<f64>,
        #[serde(skip_serializing_if = "Vec::is_empty")]
        pub variant_values: Vec<(String, String)>,
    }

    impl TextStyle {
        pub fn try_from_lookup<'a>(
            name: String,
            lookup_output: TokenQueryOutput<'a>,
        ) -> Result<Self> {
            // collected with precedents
            let mut family_name_prec: BTreeMap<isize, Cow<'a, str>> = BTreeMap::new();
            let mut line_height_px = Option::<f64>::None;
            let mut letter_spacing_px = Option::<f64>::None;
            let mut line_height_px = Option::<f64>::None;
            let mut font_size_px = 16f64;
            let mut variant_values: Vec<(String, String)> = Vec::new();
            for prop in lookup_output.properties {
                match prop {
                    TypographyProperty::FontFamily { family_name } => {
                        family_name_prec.insert(-1, family_name.clone());
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
                                family_name_prec.insert(prec as isize, name.into());
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
                key: lookup_output
                    .tokens_required
                    .into_iter()
                    .collect::<Vec<_>>()
                    .join("-"),
                // using a btree map to ensure the keys are ordered
                family_name: family_name_prec.into_values().collect(),
                font_size_px,
                line_height_px,
                letter_spacing_px,
                variant_values,
            })
        }
    }

    pub fn update_typography_for_figma(
        all_tokens: &crate::typography::output::TypographyExport,
        extension_input: &figma_config::TypographyExtensionInput,
    ) -> Result<FigmaPluginCommand> {
        let lookup = all_tokens.as_lookup();
        let mut figma_text_styles = Vec::<TextStyle>::new();

        for text_style in &extension_input.Figma.FigmaTextStyles {
            let mut collected: Vec<(Vec<String>, Vec<String>)> = Vec::new();
            collected.push((
                vec![text_style.BaseName.clone()],
                split_tokens(&text_style.BaseTokens),
            ));

            for group in &text_style.Groups {
                let original_text_styles = collected.clone();
                collected.clear();
                for original in &original_text_styles {
                    for option in &group.Options {
                        let mut new_names = original.0.clone();
                        new_names.push(option.Name.clone());

                        let mut new_tokens = original.1.clone();
                        new_tokens.extend(split_tokens(&option.Tokens));

                        collected.push((new_names, new_tokens));
                    }
                }
            }

            for collection in &collected {
                let name = collection.0.join("/");
                let lookup_output = lookup.query(&collection.1);

                figma_text_styles.push(
                    TextStyle::try_from_lookup(name, lookup_output).with_context(|| {
                        format!("Failed to create text style ({:?})", collection.0.join("/"))
                    })?,
                );
            }
        }

        Ok(FigmaPluginCommand {
            figma_plugin: FigmaPluginCommandOperation::UpdateTypography {
                text_styles: figma_text_styles,
            },
        })
    }

    fn split_tokens(x: &str) -> Vec<String> {
        let trimmed = x.trim();
        if trimmed.is_empty() {
            return Vec::new();
        }
        trimmed
            .split(|c: char| c.is_whitespace() || c == ',')
            .filter(|s| !s.is_empty())
            .map(String::from)
            .collect()
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
        pub Description: Option<String>,
        pub Groups: Vec<FigmaTextStyleMatrixGroup>,
    }

    #[derive(Codegen, Debug, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[allow(non_snake_case)]
    pub struct FigmaTextStyleMatrixGroup {
        pub Description: Option<String>,
        pub Options: Vec<FigmaTextStyleMatrixOption>,
    }

    #[derive(Codegen, Debug, Deserialize)]
    #[codegen(tags = "figma-typography-input")]
    #[allow(non_snake_case)]
    pub struct FigmaTextStyleMatrixOption {
        pub Name: String,
        pub Tokens: String,
        pub Description: Option<String>,
    }
}
