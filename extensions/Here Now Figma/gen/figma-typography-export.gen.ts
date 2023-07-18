// The data passed to the Figma plugin.
type Value = unknown;
import { TypographyExtension as _TypographyExtension, FontStyleRule as _FontStyleRule } from "./figma-typography-scalar.gen.js";
/**
 * `#[codegen(tags = "typography-export")]`
 *
 * [Source `design-tokens/src/typography/output.rs:7`](../../../design-tokens/src/typography/output.rs)
 */
export type TypographyExport = {
  properties: Array<TypographyProperty>;
  tokens: Array<[Array<string>, Array<number>]>;
  /** For example, `{"figma": FigmaTypographyConfig, "tailwind": TailwindTypographyConfig}` */
  extensions: TypographyExtension;
};
/**
 * `#[codegen(tags = "typography-export")]`
 *
 * [Source `design-tokens/src/typography/output.rs:7`](../../../design-tokens/src/typography/output.rs)
 */
export function TypographyExport(inner: TypographyExport): TypographyExport {
  return inner;
}
/**
 * `#[serde(transparent)]`
 *
 * `#[codegen(scalar, tags = "typography-export")]`
 *
 * [Source `design-tokens/src/typography/output.rs:16`](../../../design-tokens/src/typography/output.rs)
 */
export type TypographyExtension = _TypographyExtension;
/**
 * `#[serde(transparent)]`
 *
 * `#[codegen(scalar, tags = "typography-export")]`
 *
 * [Source `design-tokens/src/typography/output.rs:16`](../../../design-tokens/src/typography/output.rs)
 */
export function TypographyExtension(value: TypographyExtension): TypographyExtension {
  return value;
}
/**
 * `#[codegen(tags = "typography-export")]`
 *
 * [Source `design-tokens/src/typography/output.rs:57`](../../../design-tokens/src/typography/output.rs)
 */
// deno-lint-ignore no-namespace
export namespace TypographyProperty {
  export type ApplyFns<R> = {
    // callbacks
    FontFamily(inner: FontFamily["FontFamily"]): R,
    LineHeight(inner: LineHeight["LineHeight"]): R,
    FontSize(inner: FontSize["FontSize"]): R,
    LetterSpacing(inner: LetterSpacing["LetterSpacing"]): R,
    FontStyle(inner: FontStyle["FontStyle"]): R;
  }
  /** Match helper for {@link TypographyProperty} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: TypographyProperty) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("FontFamily" in input) return to.FontFamily(input["FontFamily"]);
      if ("LineHeight" in input) return to.LineHeight(input["LineHeight"]);
      if ("FontSize" in input) return to.FontSize(input["FontSize"]);
      if ("LetterSpacing" in input) return to.LetterSpacing(input["LetterSpacing"]);
      if ("FontStyle" in input) return to.FontStyle(input["FontStyle"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected TypographyProperty");
    }
  }
  /** Match helper for {@link TypographyProperty} */
  export function match<R>(
    input: TypographyProperty,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type FontFamily = {
    FontFamily: {
      family_name: string;
    };
  }
  export function FontFamily(value: FontFamily["FontFamily"]): FontFamily {
    return { FontFamily: value }
  }
  export type LineHeight = {
    LineHeight: {
      px: number;
    };
  }
  export function LineHeight(value: LineHeight["LineHeight"]): LineHeight {
    return { LineHeight: value }
  }
  export type FontSize = {
    FontSize: {
      px: number;
    };
  }
  export function FontSize(value: FontSize["FontSize"]): FontSize {
    return { FontSize: value }
  }
  export type LetterSpacing = {
    LetterSpacing: {
      px: number;
    };
  }
  export function LetterSpacing(value: LetterSpacing["LetterSpacing"]): LetterSpacing {
    return { LetterSpacing: value }
  }
  export type FontStyle = {
    FontStyle: FontStyleRule
  };
  export function FontStyle(value: FontStyleRule): FontStyle {
    return { FontStyle: value };
  }
}
/**
 * `#[codegen(tags = "typography-export")]`
 *
 * [Source `design-tokens/src/typography/output.rs:57`](../../../design-tokens/src/typography/output.rs)
 */
export type TypographyProperty =
  | TypographyProperty.FontFamily
  | TypographyProperty.LineHeight
  | TypographyProperty.FontSize
  | TypographyProperty.LetterSpacing
  | TypographyProperty.FontStyle
/**
 * FontStyleRule is whatever your source configuration is using to match the environment's
 * font styles to the desired weights and such.
 * Note: Due to the design system not knowing the details of these, the tooling may struggle
 * to interpolate between two possible options. Perhaps, we should leave interpolation up to
 * the implementor?
 *
 * `#[serde(transparent)]`
 *
 * `#[codegen(scalar, tags = "typography-export,typography-input")]`
 *
 * [Source `design-tokens/src/typography.rs:16`](../../../design-tokens/src/typography.rs)
 */
export type FontStyleRule = _FontStyleRule;
/**
 * FontStyleRule is whatever your source configuration is using to match the environment's
 * font styles to the desired weights and such.
 * Note: Due to the design system not knowing the details of these, the tooling may struggle
 * to interpolate between two possible options. Perhaps, we should leave interpolation up to
 * the implementor?
 *
 * `#[serde(transparent)]`
 *
 * `#[codegen(scalar, tags = "typography-export,typography-input")]`
 *
 * [Source `design-tokens/src/typography.rs:16`](../../../design-tokens/src/typography.rs)
 */
export function FontStyleRule(value: FontStyleRule): FontStyleRule {
  return value;
}
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/main.rs:33`](../../../design-tokens/src/main.rs)
 */
export type FigmaPluginCommand = {
  figma_plugin: FigmaPluginCommandOperation;
};
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/main.rs:33`](../../../design-tokens/src/main.rs)
 */
export function FigmaPluginCommand(inner: FigmaPluginCommand): FigmaPluginCommand {
  return inner;
}
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/main.rs:39`](../../../design-tokens/src/main.rs)
 */
// deno-lint-ignore no-namespace
export namespace FigmaPluginCommandOperation {
  export type ApplyFns<R> = {
    // callbacks
    UpdateTypography(inner: UpdateTypography["UpdateTypography"]): R,
  }
  /** Match helper for {@link FigmaPluginCommandOperation} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: FigmaPluginCommandOperation) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("UpdateTypography" in input) return to.UpdateTypography(input["UpdateTypography"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected FigmaPluginCommandOperation");
    }
  }
  /** Match helper for {@link FigmaPluginCommandOperation} */
  export function match<R>(
    input: FigmaPluginCommandOperation,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type UpdateTypography = {
    UpdateTypography: {
      export: FigmaTypographyExport;
    };
  }
  export function UpdateTypography(value: UpdateTypography["UpdateTypography"]): UpdateTypography {
    return { UpdateTypography: value }
  }
}
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/main.rs:39`](../../../design-tokens/src/main.rs)
 */
export type FigmaPluginCommandOperation =
  | FigmaPluginCommandOperation.UpdateTypography
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:48`](../../../design-tokens/src/typography/figma.rs)
 */
export type TextStyle = {
  name: string;
  family_name: string;
  properties: Array<TypographyProperty>;
};
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:48`](../../../design-tokens/src/typography/figma.rs)
 */
export function TextStyle(inner: TextStyle): TextStyle {
  return inner;
}
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:56`](../../../design-tokens/src/typography/figma.rs)
 */
export type FigmaTypographyExport = {
  core_styles: Array<TextStyle>;
};
/**
 * `#[codegen(tags = "figma-typography-export")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:56`](../../../design-tokens/src/typography/figma.rs)
 */
export function FigmaTypographyExport(inner: FigmaTypographyExport): FigmaTypographyExport {
  return inner;
}