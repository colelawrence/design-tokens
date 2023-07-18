type Value = unknown;
import { FontStyleRule as _FontStyleRule } from "./scalars.ts";
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
 * [Source `design-tokens/src/typography.rs:16`](../../design-tokens/src/typography.rs)
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
 * [Source `design-tokens/src/typography.rs:16`](../../design-tokens/src/typography.rs)
 */
export function FontStyleRule(value: FontStyleRule): FontStyleRule {
  return value;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:7`](../../design-tokens/src/typography/input.rs)
 */
export type Typography = {
  Families: Array<FontFamilyInfo>;
  /** Scaling strategy for different font-sizes. */
  FontSizeScale: FontSizeScale;
  TextRoles: Array<TextRole>;
  Extensions: Record<string, Value>;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:7`](../../design-tokens/src/typography/input.rs)
 */
export function Typography(inner: Typography): Typography {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:19`](../../design-tokens/src/typography/input.rs)
 */
export type TextRole = {
  /** e.g. `"ui"` or `"content"` */
  Token: string;
  /**
   * e.g. `"Inter"` or `"Merriweather"`, this must be described
   * in [Typography] "Families".
   */
  FamilyBaseName: string;
  /** e.g. tight = `1.272` or spacious = `1.61803` */
  LineHeightRule: FontFamilyLineHeightRule;
  /** Also called "letter spacing," this is the space between letters for different sizes */
  TrackingRule: FontFamilyTrackingRule;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:19`](../../design-tokens/src/typography/input.rs)
 */
export function TextRole(inner: TextRole): TextRole {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:34`](../../design-tokens/src/typography/input.rs)
 */
export type FontFamilyInfo = {
  /** e.g. `"Inter"` or `"Merriweather"` */
  BaseName: string;
  /** e.g. `"Inter"` or `"Merriweather"` */
  CSSFontFamilyName?: string | undefined | null | null | undefined;
  /** e.g. `"system-ui", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Arial", "sans-serif"` */
  CSSFontFamilyFallbacks: Array<string>;
  Weights: Array<FamilyWeightRule>;
  ItalicOption?: FontStyleRule | undefined | null | null | undefined;
  /** e.g. metrics from @capsize/metrics */
  Metrics: FontFamilyMetrics;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:34`](../../design-tokens/src/typography/input.rs)
 */
export function FontFamilyInfo(inner: FontFamilyInfo): FontFamilyInfo {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:51`](../../design-tokens/src/typography/input.rs)
 */
export type FamilyWeightRule = {
  /**
   * Number between 0 and 1000
   * For example, for "Inter":
   * * 100 is `"Thin"`
   * * 200 is `"Extra Light"`
   * * 300 is `"Light"`
   * * 400 is `"Regular"`
   * * 500 is `"Medium"`
   * * 600 is `"Semi Bold"`
   * * 700 is `"Bold"`
   * * 800 is `"Extra Bold"`
   * * 900 is `"Black"`
   */
  Weight: number;
  /** A scalar depending on the requirements of the different generators you're aiming to support */
  FontStyleRule: FontStyleRule;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:51`](../../design-tokens/src/typography/input.rs)
 */
export function FamilyWeightRule(inner: FamilyWeightRule): FamilyWeightRule {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:71`](../../design-tokens/src/typography/input.rs)
 */
export type FontSizeScale = {
  FontSizes: Array<FontSizeRel>;
  Equation: FontSizeEquation;
  /** For example, `1.0` for aligning to 1px. */
  AlignCapHeightPxOption?: number | undefined | null | null | undefined;
  /** For example, `4.0` for aligning line-heights to 4px. */
  AlignLineHeightPxOption?: number | undefined | null | null | undefined;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:71`](../../design-tokens/src/typography/input.rs)
 */
export function FontSizeScale(inner: FontSizeScale): FontSizeScale {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:83`](../../design-tokens/src/typography/input.rs)
 */
export type FontSizeRel = {
  /** e.g. `"xs"`, `"sm"`, `"base"`, `"lg"`, etc. */
  Token: string;
  /** e.g. `-2`, `-1`, `0`, `1`, etc. */
  Rel: number;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:83`](../../design-tokens/src/typography/input.rs)
 */
export function FontSizeRel(inner: FontSizeRel): FontSizeRel {
  return inner;
}
/**
 * WIP: Based on @capsizecss/metrics
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:94`](../../design-tokens/src/typography/input.rs)
 */
export type FontFamilyMetrics = {
  familyName: string;
  category: string;
  capHeight: number;
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  xHeight: number;
  xWidthAvg: number;
};
/**
 * WIP: Based on @capsizecss/metrics
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:94`](../../design-tokens/src/typography/input.rs)
 */
export function FontFamilyMetrics(inner: FontFamilyMetrics): FontFamilyMetrics {
  return inner;
}
/**
 * WIP: Based on @capsizecss/metrics
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:110`](../../design-tokens/src/typography/input.rs)
 */
// deno-lint-ignore no-namespace
export namespace FontFamilyTrackingRule {
  export type ApplyFns<R> = {
    // callbacks
    /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
    DynMetrics(inner: DynMetrics["DynMetrics"]): R,
  }
  /** Match helper for {@link FontFamilyTrackingRule} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: FontFamilyTrackingRule) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("DynMetrics" in input) return to.DynMetrics(input["DynMetrics"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected FontFamilyTrackingRule");
    }
  }
  /** Match helper for {@link FontFamilyTrackingRule} */
  export function match<R>(
    input: FontFamilyTrackingRule,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
  export type DynMetrics = {
    /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
    DynMetrics: {
      a: number;
      b: number;
      c: number;
    };
  }
  /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
  export function DynMetrics(value: DynMetrics["DynMetrics"]): DynMetrics {
    return { DynMetrics: value }
  }
}
/**
 * WIP: Based on @capsizecss/metrics
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:110`](../../design-tokens/src/typography/input.rs)
 */
export type FontFamilyTrackingRule =
  | FontFamilyTrackingRule.DynMetrics
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:127`](../../design-tokens/src/typography/input.rs)
 */
// deno-lint-ignore no-namespace
export namespace FontFamilyLineHeightRule {
  export type ApplyFns<R> = {
    // callbacks
    /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
    FontSizePxMultipler(inner: FontSizePxMultipler["FontSizePxMultipler"]): R,
  }
  /** Match helper for {@link FontFamilyLineHeightRule} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: FontFamilyLineHeightRule) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("FontSizePxMultipler" in input) return to.FontSizePxMultipler(input["FontSizePxMultipler"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected FontFamilyLineHeightRule");
    }
  }
  /** Match helper for {@link FontFamilyLineHeightRule} */
  export function match<R>(
    input: FontFamilyLineHeightRule,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
  export type FontSizePxMultipler = {
    /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
    FontSizePxMultipler: {
      multiplier: number;
    };
  }
  /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
  export function FontSizePxMultipler(value: FontSizePxMultipler["FontSizePxMultipler"]): FontSizePxMultipler {
    return { FontSizePxMultipler: value }
  }
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:127`](../../design-tokens/src/typography/input.rs)
 */
export type FontFamilyLineHeightRule =
  | FontFamilyLineHeightRule.FontSizePxMultipler
/**
 * WIP: Based on ratioInterval
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:147`](../../design-tokens/src/typography/input.rs)
 */
// deno-lint-ignore no-namespace
export namespace FontSizeEquation {
  export type ApplyFns<R> = {
    // callbacks
    Multiplier(inner: Multiplier["Multiplier"]): R,
  }
  /** Match helper for {@link FontSizeEquation} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: FontSizeEquation) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("Multiplier" in input) return to.Multiplier(input["Multiplier"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected FontSizeEquation");
    }
  }
  /** Match helper for {@link FontSizeEquation} */
  export function match<R>(
    input: FontSizeEquation,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type Multiplier = {
    Multiplier: {
      base_px: number;
      /**
       * Popular options would be `1.27201965` (sqrt(Golden Ratio)), or `1.4`
       * These would indicate the scale applied with each successive increase
       * of the font size base number.
       */
      multiplier: number;
    };
  }
  export function Multiplier(value: Multiplier["Multiplier"]): Multiplier {
    return { Multiplier: value }
  }
}
/**
 * WIP: Based on ratioInterval
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:147`](../../design-tokens/src/typography/input.rs)
 */
export type FontSizeEquation =
  | FontSizeEquation.Multiplier