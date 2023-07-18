#![allow(unused)]
use std::process::Command;

pub(crate) mod prelude {
    pub use anyhow::{Context, Error, Result};
    pub use derive_codegen::Codegen;
    pub use serde::{Deserialize, Serialize};
    pub use std::borrow::Cow;

    pub fn align_to(value: f64, to_opt: Option<f64>) -> f64 {
        match to_opt {
            Some(to) => (value / to).round() * to,
            None => value,
        }
    }
}

pub(crate) mod input {
    use crate::prelude::*;

    #[derive(Debug, Deserialize, Codegen)]
    #[codegen(tags = "input")]
    pub struct SystemInput {
        pub color_palette: crate::color::input::ColorPalette,
        pub typography: crate::typography::input::Typography,
    }
}

pub(crate) mod extensions {
    use crate::prelude::*;
    use derive_codegen::Codegen;

    #[derive(Codegen, Serialize)]
    #[codegen(tags = "figma-typography-export")]
    pub struct FigmaPluginCommand {
        figma_plugin: FigmaPluginCommandOperation,
    }

    #[derive(Codegen, Serialize)]
    #[codegen(tags = "figma-typography-export")]
    pub enum FigmaPluginCommandOperation {
        UpdateTypography {
            export: crate::typography::figma::FigmaTypographyExport,
        },
    }
}

mod cli;
mod color;
mod typography;

/// TODO
pub mod lengths {
    use crate::prelude::*;

    #[derive(Codegen, Serialize)]
    #[codegen(tags = "lengths")]
    pub struct LengthLogical {
        pixels: f64,
    }
}

fn main() {
    println!("Running at {:?} ({})", std::env::current_dir(), file!());
    cli::run();
}
