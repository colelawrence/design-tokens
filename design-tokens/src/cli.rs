//! See https://docs.rs/clap/latest/clap/_derive/_tutorial/index.html#subcommands
use std::{
    os::unix::process,
    path::{Path, PathBuf},
    process::Command,
};

use clap::{Parser, Subcommand};
use serde::de::DeserializeOwned;

use crate::input;
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
    },
    /// Generate code from example `cargo run -- example-codegen`
    ExampleCodegen,
}

pub(crate) fn run() {
    let cli = Cli::parse();
    let current_directory =
        std::env::var("CARGO_MANIFEST_DIR").expect("getting cargo manifest directory");

    match cli.command {
        Commands::ExampleCodegen => {
            derive_codegen::Generation::for_tag("input")
                .as_arg_of(
                    Command::new("deno")
                        .arg("run")
                        .arg("../vendor/derive-codegen/typescript-generator/generate-typescript.ts")
                        .arg("--includeLocationsRelativeTo=../../")
                        .arg("--fileName=input.gen.ts")
                        .arg("--importScalarsFrom=./scalars.ts")
                        .arg(r#"--prependText=type Value = unknown;"#)
                        .current_dir(&current_directory),
                )
                .with_output_path("../examples")
                .write()
                .print();

            derive_codegen::Generation::for_tag("output")
                .as_arg_of(
                    Command::new("deno")
                        .arg("run")
                        .arg("../vendor/derive-codegen/typescript-generator/generate-typescript.ts")
                        .arg("--includeLocationsRelativeTo=../../")
                        .arg("--fileName=output.gen.ts")
                        .arg("--importScalarsFrom=./scalars.ts")
                        .arg(r#"--prependText=type Value = unknown;"#)
                        .current_dir(&current_directory),
                )
                .with_output_path("../examples")
                .write()
                .print();

            derive_codegen::Generation::for_tag("figma")
                .as_arg_of(
                    Command::new("deno")
                        .arg("run")
                        .arg("../vendor/derive-codegen/typescript-generator/generate-typescript.ts")
                        .arg("--includeLocationsRelativeTo=../../../")
                        .arg("--fileName=figma.gen.ts")
                        .arg("--importScalarsFrom=../scalars.ts")
                        .arg(
                            r#"--prependText=import { TypographyProperty } from "../output.gen.ts";
type Value = unknown;"#,
                        )
                        .current_dir(&current_directory),
                )
                .with_output_path("../examples/figma")
                .write()
                .print();
        }
        Commands::TestTypography { show_settings } => {
            let input_settings = run_deno_or_exit::<input::SystemInput>(
                "./examples/get-settings-json-to-stdout.ts",
                std::iter::empty(),
            );

            if show_settings {
                println!("System settings: {input_settings:#?}");
            }
            let families_len = input_settings.typography.Families.len();
            let text_roles_len = input_settings.typography.TextRoles.len();
            println!("System settings {families_len} families, {text_roles_len} text roles");

            let all_tokens: crate::typography::output::TypographyExport =
                crate::typography::output::generate_typography_all_tokens(
                    &input_settings.typography,
                )
                .expect("generating all tokens")
                .into();

            let all_tokens_str = serde_json::to_string(&all_tokens).unwrap();
            let output = run_deno_or_exit::<serde_json::Value>(
                "./examples/tailwind/generate-tailwind-json-from-arg.ts",
                std::iter::once(all_tokens_str.as_str()),
            );

            println!("{output:#?}");
        }
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
