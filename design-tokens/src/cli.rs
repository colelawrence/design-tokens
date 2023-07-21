//! See https://docs.rs/clap/latest/clap/_derive/_tutorial/index.html#subcommands
use std::{
    os::unix::process,
    path::{Path, PathBuf},
    process::Command,
};

use clap::{Parser, Subcommand};
use serde::de::DeserializeOwned;

/// Simple program to greet a person
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Generate from example `cargo run -- test-typography`
    TestTypography {
        #[clap(long)]
        show_settings: bool,
        #[clap(long)]
        print_all_tokens: bool,
        #[clap(long)]
        print_figma_input: bool,
    },
    /// Generate code from example `cargo run -- dev-codegen`
    DevCodegen,
}

pub(crate) fn run() {
    let cli = Cli::parse();
    let manifest_dir = PathBuf::from(
        std::env::var("CARGO_MANIFEST_DIR").expect("getting cargo manifest directory"),
    )
    .canonicalize()
    .expect("finding cargo manifest directory");

    match cli.command {
        Commands::DevCodegen => {
            let dev = DesignTokensDev {
                project_root: manifest_dir
                    .parent()
                    .expect("getting project root (parent of cargo manifest directory)")
                    .to_path_buf(),
            };
            dev.generate_helpers_for_sdks();
        }
        Commands::TestTypography {
            show_settings,
            print_all_tokens,
            print_figma_input,
        } => {
            let input_settings = run_deno_or_exit::<crate::input::SystemInput>(
                "./examples/get-settings-json-to-stdout.ts",
                std::iter::empty(),
            );

            if show_settings {
                eprintln!("System settings: {input_settings:#?}");
            }
            let families_len = input_settings.typography.Families.len();
            let text_roles_len = input_settings.typography.TextRoles.len();
            eprintln!("System settings {families_len} families, {text_roles_len} text roles");

            let all_tokens: crate::typography::output::TypographyExport =
                crate::typography::output::generate_typography_all_tokens(
                    &input_settings.typography,
                )
                .expect("generating all tokens")
                .into();
            if print_all_tokens {
                let mut formatter = serde_json::ser::PrettyFormatter::new();

                let pretty =
                    serde_json::to_string(&all_tokens).expect("json stringifying all tokens")
                    .replace("}},{", "}},\n  {")
                    .replace("\"tokens\":[", "\n\"tokens\":[\n  ")
                    .replace("\"properties\":[", "\n\"properties\":[\n  ")
                    .replace("\"extensions\":{", "\n\"extensions\":{\n")
                    .replace("]],[[", "]],\n  [[");
                println!("####BEGIN:ALL TOKENS####\n{pretty}\n####END:ALL TOKENS####");
            }

            if print_figma_input {
                let figma_extension_input =
                    serde_json::from_value::<
                        crate::typography::figma::figma_config::TypographyExtensionInput,
                    >(input_settings.typography.Extensions.clone())
                    .expect("reading Figma extension input");

                let figma_plugin_command =
                    crate::typography::figma::figma_export::update_typography_for_figma(
                        &all_tokens,
                        &figma_extension_input,
                    )
                    .expect("getting an update command for Figma plugin");

                println!(
                    "####BEGIN:FIGMA PLUGIN COMMAND####\n{}\n####END:FIGMA PLUGIN COMMAND####",
                    serde_json::to_string(&figma_plugin_command)
                        .expect("json stringifying figma plugin command")
                        .replace(
                            r#"},{"name""#,
                            r#"},
    {"name""#
                        )
                );
            }

            // let output = run_deno_or_exit::<serde_json::Value>(
            //     "./examples/tailwind/generate-tailwind-json-from-arg.ts",
            //     std::iter::once(all_tokens_str.as_str()),
            // );

            // eprintln!("{output:#?}");
        }
    }
}

struct DesignTokensDev {
    project_root: PathBuf,
}

impl DesignTokensDev {
    pub fn generate_helpers_for_sdks(&self) {
        derive_codegen::Generation::for_tag("typography-input")
            .include_tag("css-typography-scalar")
            .include_tag("tailwind-typography-input")
            .include_tag("figma-typography-scalar")
            .include_tag("figma-typography-input")
            .as_arg_of(
                Command::new("deno")
                    .arg("run")
                    .arg("./vendor/derive-codegen/typescript-generator/generate-typescript.ts")
                    .arg("--includeLocationsRelativeTo=../../")
                    .arg("--fileName=typography-input.gen.ts")
                    .arg(r#"--prependText=type Value = unknown;"#)
                    .current_dir(&self.project_root),
            )
            .with_output_path("./examples")
            .write()
            .print();

        derive_codegen::Generation::for_tag("figma-typography-export")
            .include_tag("typography-export")
            .as_arg_of(
                Command::new("deno")
                    .arg("run")
                    .arg("./vendor/derive-codegen/typescript-generator/generate-typescript.ts")
                    .arg("--includeLocationsRelativeTo=../../../")
                    .arg("--fileName=figma-typography-export.gen.ts")
                    .arg("--importScalarsFrom=./figma-typography-scalar.gen.js")
                    .arg(
                        r#"--prependText=// The data passed to the Figma plugin.
type Value = unknown;"#,
                    )
                    .current_dir(&self.project_root),
            )
            .with_output_path("./extensions/Here Now Figma/gen")
            .write()
            .print();

        derive_codegen::Generation::for_tag("figma-typography-scalar")
            .include_tag("figma-typography-input")
            .as_arg_of(
                Command::new("deno")
                    .arg("run")
                    .arg("./vendor/derive-codegen/typescript-generator/generate-typescript.ts")
                    .arg("--includeLocationsRelativeTo=../../../")
                    .arg("--fileName=figma-typography-scalar.gen.ts")
                    .arg(r#"--prependText=// The typography data specific for the Figma plugin."#)
                    .current_dir(&self.project_root),
            )
            .with_output_path("./extensions/Here Now Figma/gen")
            .write()
            .print();
    }
}

fn run_deno_or_exit<'a, T: DeserializeOwned>(
    file_path: &str,
    args: impl Iterator<Item = &'a str>,
) -> T {
    let manifest_dir = PathBuf::from(
        std::env::var("CARGO_MANIFEST_DIR").expect("getting cargo manifest directory"),
    );
    let root_directory = manifest_dir
        .parent()
        .expect("getting root directory is parent of manifest directory");

    let output = Command::new("deno")
        .arg("run")
        .arg(file_path)
        .args(args)
        .stdout(std::process::Stdio::piped())
        .current_dir(&root_directory)
        .spawn()
        .expect("starting deno")
        .wait_with_output()
        .expect("exiting deno");

    if !output.status.success() {
        std::process::exit(output.status.code().unwrap_or_default());
    }

    match serde_json::from_slice(&output.stdout) {
        Ok(found) => found,
        Err(err) => {
            panic!("failed to parse output from `deno run {file_path:?}` command: {err:#?}\nINPUT (SHOULD BE JSON):\n{}", String::from_utf8_lossy(&output.stdout))
        }
    }
}
