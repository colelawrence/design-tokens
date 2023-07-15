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
    let command = if let Some(command) = opts.command {
        command
    } else {
        eprintln!("Sub-command required\n\n{}", opts.self_usage());
        std::process::exit(1);
    };

    match command {
        XtaskCommand::Fix(opts) => fix(opts),
        XtaskCommand::Docs(opts) => docs(opts),
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

fn expect_success(output: &Output) {
    if !output.status.success() {
        process::exit(output.status.code().unwrap_or(1))
    }
}
