/** `#[codegen(tags = "hn-figma-types")]` */
// deno-lint-ignore no-namespace
export namespace MessageToUI {
  export type ApplyFns<R> = {
    // callbacks
    LoadCollections(inner: LoadCollections["LoadCollections"]): R,
  }
  /** Match helper for {@link MessageToUI} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: MessageToUI) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("LoadCollections" in input) return to.LoadCollections(input["LoadCollections"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected MessageToUI");
    }
  }
  /** Match helper for {@link MessageToUI} */
  export function match<R>(
    input: MessageToUI,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type LoadCollections = {
    LoadCollections: {
      collections: Array<CollectionInfo>;
    };
  }
  export function LoadCollections(value: LoadCollections["LoadCollections"]): LoadCollections {
    return { LoadCollections: value }
  }
}
/** `#[codegen(tags = "hn-figma-types")]` */
export type MessageToUI =
  | MessageToUI.LoadCollections
/** `#[codegen(tags = "hn-figma-types")]` */
// deno-lint-ignore no-namespace
export namespace MessageToPlugin {
  export type ApplyFns<R> = {
    // callbacks
    ImportJSONFileToVariables(inner: ImportJSONFileToVariables["ImportJSONFileToVariables"]): R,
    Command(inner: Command["Command"]): R,
  }
  /** Match helper for {@link MessageToPlugin} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: MessageToPlugin) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("ImportJSONFileToVariables" in input) return to.ImportJSONFileToVariables(input["ImportJSONFileToVariables"]);
      if ("Command" in input) return to.Command(input["Command"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected MessageToPlugin");
    }
  }
  /** Match helper for {@link MessageToPlugin} */
  export function match<R>(
    input: MessageToPlugin,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type ImportJSONFileToVariables = {
    ImportJSONFileToVariables: {
      selected_collection_id: IDOrNew;
      selected_mode_id: IDOrNew;
      /** `#[codegen(ts_as = "unknown")]` */
      json: unknown;
    };
  }
  export function ImportJSONFileToVariables(value: ImportJSONFileToVariables["ImportJSONFileToVariables"]): ImportJSONFileToVariables {
    return { ImportJSONFileToVariables: value }
  }
  export type Command = {
    Command: {
      /** `#[codegen(ts_as = "import(\"./figma-typography-export.gen.js\").FigmaPluginCommand")]` */
      command: import("./figma-typography-export.gen.js").FigmaPluginCommand;
    };
  }
  export function Command(value: Command["Command"]): Command {
    return { Command: value }
  }
}
/** `#[codegen(tags = "hn-figma-types")]` */
export type MessageToPlugin =
  | MessageToPlugin.ImportJSONFileToVariables
  | MessageToPlugin.Command
/** `#[codegen(tags = "hn-figma-types")]` */
// deno-lint-ignore no-namespace
export namespace IDOrNew {
  export type ApplyFns<R> = {
    // callbacks
    ID(inner: ID["ID"]): R;
    NewWithName(inner: NewWithName["NewWithName"]): R;
  }
  /** Match helper for {@link IDOrNew} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: IDOrNew) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("ID" in input) return to.ID(input["ID"]);
      if ("NewWithName" in input) return to.NewWithName(input["NewWithName"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected IDOrNew");
    }
  }
  /** Match helper for {@link IDOrNew} */
  export function match<R>(
    input: IDOrNew,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type ID = {
    ID: string
  };
  export function ID(value: string): ID {
    return { ID: value };
  }
  export type NewWithName = {
    NewWithName: string
  };
  export function NewWithName(value: string): NewWithName {
    return { NewWithName: value };
  }
}
/** `#[codegen(tags = "hn-figma-types")]` */
export type IDOrNew =
  | IDOrNew.ID
  | IDOrNew.NewWithName
/** `#[codegen(tags = "hn-figma-types")]` */
export type CollectionInfo = {
  collection_id: string;
  collection_name: string;
  default_mode_id: string;
  modes: Array<CollectionModeInfo>;
};
/** `#[codegen(tags = "hn-figma-types")]` */
export function CollectionInfo(inner: CollectionInfo): CollectionInfo {
  return inner;
}
/** `#[codegen(tags = "hn-figma-types")]` */
export type CollectionModeInfo = {
  mode_id: string;
  mode_name: string;
};
/** `#[codegen(tags = "hn-figma-types")]` */
export function CollectionModeInfo(inner: CollectionModeInfo): CollectionModeInfo {
  return inner;
}