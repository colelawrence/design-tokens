type Value = unknown;
/**
 * This must have the same name as the [crate::typography::scalars::FontStyleRule].
 * Another way to think of this is the "CSS-specific" settings.
 *
 * `#[codegen(ts_interface_merge, tags = "css-typography-scalar")]`
 *
 * [Source `design-tokens/src/typography/css.rs:9`](../../design-tokens/src/typography/css.rs)
 */
export interface FontStyleRule {
  /** `#[serde(alias = "css")]` */
  CSS: Array<CSSFontStyleRule>;
}
/**
 * `#[codegen(tags = "css-typography-scalar")]`
 *
 * [Source `design-tokens/src/typography/css.rs:18`](../../design-tokens/src/typography/css.rs)
 */
// deno-lint-ignore no-namespace
export namespace CSSFontStyleRule {
  export type ApplyFns<R> = {
    // callbacks
    FontStyleItalics(): R,
    FontWeightBold(): R,
    FontWeight(inner: FontWeight["FontWeight"]): R;
    /**
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
     * e.g. `"'wght' 50"`
     */
    FontVariationSetting(inner: FontVariationSetting["FontVariationSetting"]): R;
  }
  /** Match helper for {@link CSSFontStyleRule} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: CSSFontStyleRule) => R {
    return function _match(input): R {
      // if-else strings
      if (input === "FontStyleItalics") return to.FontStyleItalics();
      if (input === "FontWeightBold") return to.FontWeightBold();
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("FontWeight" in input) return to.FontWeight(input["FontWeight"]);
      if ("FontVariationSetting" in input) return to.FontVariationSetting(input["FontVariationSetting"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected CSSFontStyleRule");
    }
  }
  /** Match helper for {@link CSSFontStyleRule} */
  export function match<R>(
    input: CSSFontStyleRule,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  export type FontStyleItalics = "FontStyleItalics"
  export function FontStyleItalics(): FontStyleItalics {
    return "FontStyleItalics";
  }
  export type FontWeightBold = "FontWeightBold"
  export function FontWeightBold(): FontWeightBold {
    return "FontWeightBold";
  }
  export type FontWeight = {
    FontWeight: number
  };
  export function FontWeight(value: number): FontWeight {
    return { FontWeight: value };
  }
  /**
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
   * e.g. `"'wght' 50"`
   */
  export type FontVariationSetting = {
    /**
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
     * e.g. `"'wght' 50"`
     */
    FontVariationSetting: string
  };
  /**
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
   * e.g. `"'wght' 50"`
   */
  export function FontVariationSetting(value: string): FontVariationSetting {
    return { FontVariationSetting: value };
  }
}
/**
 * `#[codegen(tags = "css-typography-scalar")]`
 *
 * [Source `design-tokens/src/typography/css.rs:18`](../../design-tokens/src/typography/css.rs)
 */
export type CSSFontStyleRule =
  | CSSFontStyleRule.FontStyleItalics
  | CSSFontStyleRule.FontWeightBold
  | CSSFontStyleRule.FontWeight
  | CSSFontStyleRule.FontVariationSetting
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
 * [Source `design-tokens/src/typography.rs:17`](../../design-tokens/src/typography.rs)
 */
export function FontStyleRule(value: FontStyleRule): FontStyleRule {
  return value;
}
/**
 * This must have the same name as the [crate::typography::scalars::FontStyleRule].
 * TODO: Perhaps we can make it so the multiple scalars can be combined somehow
 * like if there is another scalar for css::css_scalars.
 * Another way to think of this is the "Figma-specific" settings.
 *
 * `#[codegen(ts_interface_merge, tags = "figma-typography-scalar")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:14`](../../design-tokens/src/typography/figma.rs)
 */
export interface FontStyleRule {
  /** `#[serde(alias = "figma")]` */
  Figma: FigmaFontStyleRule;
}
/**
 * String that follows the base name of the family.
 * This is used for your design programs like Figma.
 * e.g. `" Italic"` for italics of Inter or Source Serif
 * e.g. `" Thin"` for W100, `" Light"` for W300, `" Medium"` for W500, `" Bold"` for W700, etc.
 *
 * `#[codegen(tags = "figma-typography-scalar")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:29`](../../design-tokens/src/typography/figma.rs)
 */
// deno-lint-ignore no-namespace
export namespace FigmaFontStyleRule {
  export type ApplyFns<R> = {
    // callbacks
    /** Suffix plus order number */
    FontSuffix(inner: [string, number]): R,
    /**
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
     * e.g. `"'wght' 50"`
     */
    FontVariation(inner: [string, string]): R,
  }
  /** Match helper for {@link FigmaFontStyleRule} */
  export function apply<R>(
    to: ApplyFns<R>,
  ): (input: FigmaFontStyleRule) => R {
    return function _match(input): R {
      // if-else strings
      // if-else objects
      if (typeof input !== "object" || input == null) throw new TypeError("Unexpected non-object for input");
      if ("FontSuffix" in input) return to.FontSuffix(input["FontSuffix"]);
      if ("FontVariation" in input) return to.FontVariation(input["FontVariation"]);
      const _exhaust: never = input;
      throw new TypeError("Unknown object when expected FigmaFontStyleRule");
    }
  }
  /** Match helper for {@link FigmaFontStyleRule} */
  export function match<R>(
    input: FigmaFontStyleRule,
    to: ApplyFns<R>,
  ): R {
    return apply(to)(input)
  }
  /** Suffix plus order number */
  export type FontSuffix = { FontSuffix: [string, number] };
  /** Suffix plus order number */
  export function FontSuffix(a: string, b: number): FontSuffix {
    return { FontSuffix: [a, b] };
  }
  /**
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
   * e.g. `"'wght' 50"`
   */
  export type FontVariation = { FontVariation: [string, string] };
  /**
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
   * e.g. `"'wght' 50"`
   */
  export function FontVariation(a: string, b: string): FontVariation {
    return { FontVariation: [a, b] };
  }
}
/**
 * String that follows the base name of the family.
 * This is used for your design programs like Figma.
 * e.g. `" Italic"` for italics of Inter or Source Serif
 * e.g. `" Thin"` for W100, `" Light"` for W300, `" Medium"` for W500, `" Bold"` for W700, etc.
 *
 * `#[codegen(tags = "figma-typography-scalar")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:29`](../../design-tokens/src/typography/figma.rs)
 */
export type FigmaFontStyleRule =
  | FigmaFontStyleRule.FontSuffix
  | FigmaFontStyleRule.FontVariation
/**
 * Depends on `css-typography-scalars`
 *
 * `#[codegen(ts_interface_merge, tags = "tailwind-typography-input")]`
 *
 * [Source `design-tokens/src/typography/tailwind.rs:16`](../../design-tokens/src/typography/tailwind.rs)
 */
export interface TypographyExtensionInput {
  /** `#[serde(alias = "tailwind")]` */
  Tailwind: TailwindTypographyConfig;
}
/**
 * `#[codegen(tags = "tailwind-typography-input")]`
 *
 * [Source `design-tokens/src/typography/tailwind.rs:25`](../../design-tokens/src/typography/tailwind.rs)
 */
export type TailwindTypographyConfig = {
  /** A sort of matrice of all possible combinations of the variants */
  TailwindTextClasses: [];
};
/**
 * `#[codegen(tags = "tailwind-typography-input")]`
 *
 * [Source `design-tokens/src/typography/tailwind.rs:25`](../../design-tokens/src/typography/tailwind.rs)
 */
export function TailwindTypographyConfig(inner: TailwindTypographyConfig): TailwindTypographyConfig {
  return inner;
}
/**
 * `#[codegen(ts_interface_merge, tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:61`](../../design-tokens/src/typography/figma.rs)
 */
export interface TypographyExtensionInput {
  /** `#[serde(alias = "figma")]` */
  Figma: FigmaTypographyConfig;
}
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:70`](../../design-tokens/src/typography/figma.rs)
 */
export type FigmaTypographyConfig = {
  /** A sort of matrice of all possible combinations of the variants */
  FigmaTextStyles: Array<FigmaTextStyle>;
};
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:70`](../../design-tokens/src/typography/figma.rs)
 */
export function FigmaTypographyConfig(inner: FigmaTypographyConfig): FigmaTypographyConfig {
  return inner;
}
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:80`](../../design-tokens/src/typography/figma.rs)
 */
export type FigmaTextStyle = {
  BaseName: string;
  BaseTokens: string;
  Description?: string | undefined | null | null | undefined;
  Groups: Array<FigmaTextStyleMatrixGroup>;
};
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:80`](../../design-tokens/src/typography/figma.rs)
 */
export function FigmaTextStyle(inner: FigmaTextStyle): FigmaTextStyle {
  return inner;
}
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:90`](../../design-tokens/src/typography/figma.rs)
 */
export type FigmaTextStyleMatrixGroup = {
  Description?: string | undefined | null | null | undefined;
  Options: Array<FigmaTextStyleMatrixOption>;
};
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:90`](../../design-tokens/src/typography/figma.rs)
 */
export function FigmaTextStyleMatrixGroup(inner: FigmaTextStyleMatrixGroup): FigmaTextStyleMatrixGroup {
  return inner;
}
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:98`](../../design-tokens/src/typography/figma.rs)
 */
export type FigmaTextStyleMatrixOption = {
  Name: string;
  Tokens: string;
  Description?: string | undefined | null | null | undefined;
};
/**
 * `#[codegen(tags = "figma-typography-input")]`
 *
 * [Source `design-tokens/src/typography/figma.rs:98`](../../design-tokens/src/typography/figma.rs)
 */
export function FigmaTextStyleMatrixOption(inner: FigmaTextStyleMatrixOption): FigmaTextStyleMatrixOption {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:7`](../../design-tokens/src/typography/input.rs)
 */
export type BaseTypographyInput = {
  Families: Array<FontFamilyInfo>;
  /** Scaling strategy for different font-sizes. */
  FontSizeScale: FontSizeScale;
  TextRoles: Array<TextRole>;
  /** `#[codegen(ts_as = "TypographyExtensionInput")]` */
  Extensions: TypographyExtensionInput;
};
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:7`](../../design-tokens/src/typography/input.rs)
 */
export function BaseTypographyInput(inner: BaseTypographyInput): BaseTypographyInput {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:20`](../../design-tokens/src/typography/input.rs)
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
 * [Source `design-tokens/src/typography/input.rs:20`](../../design-tokens/src/typography/input.rs)
 */
export function TextRole(inner: TextRole): TextRole {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:35`](../../design-tokens/src/typography/input.rs)
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
 * [Source `design-tokens/src/typography/input.rs:35`](../../design-tokens/src/typography/input.rs)
 */
export function FontFamilyInfo(inner: FontFamilyInfo): FontFamilyInfo {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:52`](../../design-tokens/src/typography/input.rs)
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
 * [Source `design-tokens/src/typography/input.rs:52`](../../design-tokens/src/typography/input.rs)
 */
export function FamilyWeightRule(inner: FamilyWeightRule): FamilyWeightRule {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:72`](../../design-tokens/src/typography/input.rs)
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
 * [Source `design-tokens/src/typography/input.rs:72`](../../design-tokens/src/typography/input.rs)
 */
export function FontSizeScale(inner: FontSizeScale): FontSizeScale {
  return inner;
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:84`](../../design-tokens/src/typography/input.rs)
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
 * [Source `design-tokens/src/typography/input.rs:84`](../../design-tokens/src/typography/input.rs)
 */
export function FontSizeRel(inner: FontSizeRel): FontSizeRel {
  return inner;
}
/**
 * WIP: Based on @capsizecss/metrics
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:95`](../../design-tokens/src/typography/input.rs)
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
 * [Source `design-tokens/src/typography/input.rs:95`](../../design-tokens/src/typography/input.rs)
 */
export function FontFamilyMetrics(inner: FontFamilyMetrics): FontFamilyMetrics {
  return inner;
}
/**
 * WIP: Based on @capsizecss/metrics
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:111`](../../design-tokens/src/typography/input.rs)
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
  };
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
 * [Source `design-tokens/src/typography/input.rs:111`](../../design-tokens/src/typography/input.rs)
 */
export type FontFamilyTrackingRule =
  | FontFamilyTrackingRule.DynMetrics
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:128`](../../design-tokens/src/typography/input.rs)
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
  };
  /** Determine your tracking goals via a page like https://rsms.me/inter/dynmetrics/ */
  export function FontSizePxMultipler(value: FontSizePxMultipler["FontSizePxMultipler"]): FontSizePxMultipler {
    return { FontSizePxMultipler: value }
  }
}
/**
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:128`](../../design-tokens/src/typography/input.rs)
 */
export type FontFamilyLineHeightRule =
  | FontFamilyLineHeightRule.FontSizePxMultipler
/**
 * WIP: Based on ratioInterval
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:148`](../../design-tokens/src/typography/input.rs)
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
  };
  export function Multiplier(value: Multiplier["Multiplier"]): Multiplier {
    return { Multiplier: value }
  }
}
/**
 * WIP: Based on ratioInterval
 *
 * `#[codegen(tags = "typography-input")]`
 *
 * [Source `design-tokens/src/typography/input.rs:148`](../../design-tokens/src/typography/input.rs)
 */
export type FontSizeEquation =
  | FontSizeEquation.Multiplier