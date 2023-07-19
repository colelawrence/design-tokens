use crate::prelude::*;

pub mod css_scalars {
    use crate::prelude::*;

    /// This must have the same name as the [crate::typography::scalars::FontStyleRule].
    ///
    /// Another way to think of this is the "CSS-specific" settings.
    #[derive(Codegen)]
    #[codegen(tags = "css-typography-scalar")]
    #[codegen(ts_interface_merge)] // so it can be combined with other specified scalars
    #[allow(non_snake_case)]
    pub struct FontStyleRule {
        #[serde(alias = "css")]
        CSS: Vec<CSSFontStyleRule>,
    }

    #[derive(Codegen, Clone, Debug, Serialize)]
    #[codegen(tags = "css-typography-scalar")]
    #[allow(non_snake_case)]
    pub enum CSSFontStyleRule {
        FontStyleItalics,
        FontWeightBold,
        FontWeight(usize),
        /// See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
        /// e.g. `"'wght' 50"`
        FontVariationSetting(String),
    }
}
