use gumdrop::Options;
use std::{
    path::PathBuf,
    process::{self, Command, Output},
};

#[derive(Options)]
enum XtaskCommand {
    // Command names are generated from variant names.
    // By default, a CamelCase name will be converted into a lowercase,
    // hyphen-separated name; e.g. `FooBar` becomes `foo-bar`.
    //
    // Names can be explicitly specified using `#[options(name = "...")]`
    #[options(name = "fix-code", help = "lint fixes")]
    Fix(FixOptions),
    #[options(name = "doc-code", help = "generate and show docs")]
    Docs(DocsOptions),
    #[options(name = "extension-figma-here-now-dev")]
    ExtensionFigmaHereNowDev(NoOptions),
    #[options(name = "codegen")]
    Codegen(NoOptions),
    #[options(name = "test-typography-for-figma-plugin")]
    TestTypographyForFigmaPlugin(NoOptions),
    #[options(name = "test-typography-e2e")]
    TestTypographyE2E(NoOptions),
}

// Define options for the program.
#[derive(Options)]
struct MyOptions {
    // Options here can be accepted with any command (or none at all),
    // but they must come before the command name.
    #[options(help = "print help message")]
    help: bool,
    // #[options(help = "be verbose")]
    // verbose: bool,

    // The `command` option will delegate option parsing to the command type,
    // starting at the first free argument.
    #[options(command)]
    command: Option<XtaskCommand>,
}

fn main() {
    let opts = MyOptions::parse_args_default_or_exit();
    if opts.help {
        println!("{}", opts.self_usage());
        std::process::exit(0);
    }

    let command = opts.command.unwrap_or_else(|| {
        eprintln!("Opening interactive mode");

        inquire::Select::new(
            "Pick thing you want to do",
            [
                PickXtask(XtaskCommand::Docs(DocsOptions {})),
                PickXtask(XtaskCommand::Fix(FixOptions {})),
                PickXtask(XtaskCommand::Codegen(NoOptions {})),
                PickXtask(XtaskCommand::ExtensionFigmaHereNowDev(NoOptions {})),
                PickXtask(XtaskCommand::TestTypographyForFigmaPlugin(NoOptions {})),
                PickXtask(XtaskCommand::TestTypographyE2E(NoOptions {})),
            ]
            .into_iter()
            .collect(),
        )
        .prompt()
        .expect("picking command")
        .0
    });

    return match command {
        XtaskCommand::Fix(opts) => fix(opts),
        XtaskCommand::Docs(opts) => docs(opts),
        XtaskCommand::Codegen(opts) => codegen(opts),
        XtaskCommand::ExtensionFigmaHereNowDev(opts) => extension_figma_here_now_dev(opts),
        XtaskCommand::TestTypographyForFigmaPlugin(opts) => test_typography_for_figma_plugin(opts),
        XtaskCommand::TestTypographyE2E(opts) => {
            codegen(opts);
            test_typography_for_figma_plugin(opts);
        }
    };
}

struct PickXtask(XtaskCommand);

impl std::fmt::Display for PickXtask {
    fn fmt(&self, mut f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(name) = self.0.command_name() {
            write!(&mut f, "{}", name)?;
            if let Some(list) = self.0.self_command_list() {
                write!(&mut f, ": {}", list)?;
            }
        }
        if let Some(options) = self.0.command() {
            if let Some(name) = options.command_name() {
                write!(&mut f, ": {}", name)?;
            }
        }
        Ok(())
    }
}

fn get_project_root_dir() -> PathBuf {
    std::env::vars_os()
        .into_iter()
        .filter_map(|(key, value)| (key == "CARGO_MANIFEST_DIR").then_some(value))
        .next()
        .and_then(|value| PathBuf::from(value).parent().map(PathBuf::from))
        .unwrap_or_else(|| std::env::current_dir().unwrap())
}

#[derive(Options)]
struct FixOptions {}
fn fix(_: FixOptions) {
    let root_dir = get_project_root_dir();
    let output = Command::new("cargo")
        .args("fix --allow-dirty --allow-staged".split(' '))
        .current_dir(&root_dir)
        .spawn()
        .expect("fixing code")
        .wait_with_output()
        .expect("exiting");

    expect_success(&output);

    let output = Command::new("cargo")
        .args("fmt".split(' '))
        .current_dir(root_dir)
        .spawn()
        .expect("formatting code")
        .wait_with_output()
        .expect("exiting");

    expect_success(&output);
}

#[derive(Options)]
struct DocsOptions {}
fn docs(_: DocsOptions) {
    let root_dir = get_project_root_dir();
    let output = Command::new("cargo")
        .args("+nightly doc --open".split(' '))
        .current_dir(root_dir)
        .spawn()
        .expect("fixing code")
        .wait_with_output()
        .expect("exiting");

    expect_success(&output);
}

#[derive(Options, Clone, Copy)]
struct NoOptions {}

fn extension_figma_here_now_dev(_: NoOptions) {
    let root_dir = get_project_root_dir();
    let output = Command::new("watchexec")
        .args("-w ui-src".split(' '))
        .args("-w plugin-src".split(' '))
        .args("-w gen".split(' '))
        .arg("node ./build.cjs")
        .current_dir(root_dir.join("./extensions/Here Now Figma"))
        .spawn()
        .expect("watching figma plugin code")
        .wait_with_output()
        .expect("exiting");

    expect_success(&output);
}

fn test_typography_for_figma_plugin(_: NoOptions) {
    let root_dir = get_project_root_dir();
    let output = Command::new("cargo")
        .args("run -- test-typography".split(' '))
        .current_dir(root_dir.join("./design-tokens"))
        .spawn()
        .expect("testing typography for figma plugin code")
        .wait_with_output()
        .expect("exiting");
    expect_success(&output);
}

fn codegen(_: NoOptions) {
    let root_dir = get_project_root_dir();
    let output = Command::new("cargo")
        .args("run --bin protocol-types".split(' '))
        .current_dir(root_dir.join("./extensions/Here Now Figma/protocol-types"))
        .spawn()
        .expect("building types for figma plugin code")
        .wait_with_output()
        .expect("exiting");
    expect_success(&output);

    let output = Command::new("cargo")
        .args("run --bin design-tokens -- dev-codegen".split(' '))
        .current_dir(root_dir.join("./design-tokens"))
        .spawn()
        .expect("building types for extensions and settings")
        .wait_with_output()
        .expect("exiting");
    expect_success(&output);
}

fn expect_success(output: &Output) {
    if !output.status.success() {
        process::exit(output.status.code().unwrap_or(1))
    }
}
