use super::{input, output, scalars};
use crate::prelude::*;

#[derive(Codegen, Debug)]
#[codegen(tags = "tailwind-typography-export")]
#[allow(non_snake_case)]
pub struct TailwindTypographyExport {
    // hmmm
}

pub mod tailwind_config {
    use crate::prelude::*;

    // Must be named `TypographyExtensionInput` to ensure it merges with other typography extensions
    /// Depends on `css-typography-scalars`
    #[derive(Debug, Codegen)]
    #[codegen(tags = "tailwind-typography-input")]
    #[codegen(ts_interface_merge)]
    #[allow(non_snake_case)]
    pub struct TypographyExtensionInput {
        #[serde(alias = "tailwind")]
        Tailwind: TailwindTypographyConfig,
    }

    #[derive(Codegen, Debug)]
    #[codegen(tags = "tailwind-typography-input")]
    #[allow(non_snake_case)]
    pub struct TailwindTypographyConfig {
        // TODO: Some kind of narrowing / selections for creating types / lints for the design system
        // e.g. we should be able to swap the font families, even if the new one has fewer weights.
        /// A sort of matrice of all possible combinations of the variants
        pub TailwindTextClasses: (),
    }
}

pub fn generate_typography_for_tailwind(
    all_tokens: &output::TypographyExport,
    tailwind_settings: &tailwind_config::TailwindTypographyConfig,
) -> Result<TailwindTypographyExport> {
    Ok(TailwindTypographyExport {
        // core_styles: todo!("use all tokens to create core styles: {all_tokens:#?}"),
    })
}
