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
    #[derive(Codegen)]
    #[codegen(tags = "figma-typography-scalar")]
    // ts_interface_merge: so it can be combined with other specified scalars (WIP 0/10: maybe not very nice for other languages...)
    #[codegen(ts_interface_merge)]
    #[allow(non_snake_case)]
    pub struct FontStyleRule {
        #[serde(alias = "figma")]
        Figma: FigmaFontStyleRule,
    }

    // should this just be something like file distributable name?
    /// String that follows the base name of the family.
    /// This is used for your design programs like Figma.
    /// e.g. `" Italic"` for italics of Inter or Source Serif
    /// e.g. `" Thin"` for W100, `" Light"` for W300, `" Medium"` for W500, `" Bold"` for W700, etc.
    #[derive(Codegen, Clone, Debug, Serialize)]
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
    use crate::prelude::*;
    use derive_codegen::Codegen;

    use super::figma_config;

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
        pub family_name: String,
        pub properties: Vec<crate::typography::output::TypographyProperty>,
    }

    pub fn update_typography_for_figma(
        all_tokens: &crate::typography::output::TypographyExport,
        extension_input: &figma_config::TypographyExtensionInput,
    ) -> Result<FigmaPluginCommand> {
        eprintln!("TODO: use all tokens to create core styles: {all_tokens:?}");
        Ok(FigmaPluginCommand {
            figma_plugin: FigmaPluginCommandOperation::UpdateTypography {
                text_styles: Vec::new(),
            },
        })
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
        Figma: FigmaTypographyConfig,
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
