#![allow(unused)]
use std::{env, path::PathBuf, process::Command};

use derive_codegen::{Codegen, Generation};

#[derive(Codegen)]
#[codegen(tags = "hn-figma-types")]
enum MessageToUI {
    LoadCollections { collections: Vec<CollectionInfo> },
}

#[derive(Codegen)]
#[codegen(tags = "hn-figma-types")]
enum MessageToPlugin {
    ImportJSONFileToVariables {
        selected_collection_id: IDOrNew,
        selected_mode_id: IDOrNew,
        #[codegen(ts_as = "unknown")]
        json: (),
    },
    Command {
        #[codegen(ts_as = "import(\"./figma-typography-export.gen.js\").FigmaPluginCommand")]
        command: ()
    },
}

#[derive(Codegen)]
#[codegen(tags = "hn-figma-types")]
enum IDOrNew {
    ID(String),
    NewWithName(String),
}

#[derive(Codegen)]
#[codegen(tags = "hn-figma-types")]
struct CollectionInfo {
    collection_id: String,
    collection_name: String,
    default_mode_id: String,
    modes: Vec<CollectionModeInfo>,
}

#[derive(Codegen)]
#[codegen(tags = "hn-figma-types")]
struct CollectionModeInfo {
    mode_id: String,
    mode_name: String,
}

fn main() {
    let figma_plugin_directory = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
        .parent()
        .map(PathBuf::from)
        .unwrap();

    Generation::for_tag("hn-figma-types")
        .as_arg_of(
            Command::new("deno")
                .arg("run")
                .arg("protocol-types/generator/generate-typescript.ts")
                .arg("--fileName=protocol-types.gen.ts")
                .current_dir(&figma_plugin_directory),
        )
        .with_output_path("./gen")
        .write()
        .print();
}
