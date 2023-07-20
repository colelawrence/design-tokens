// import workSansMetrics from "@capsizecss/metrics/workSans";
import * as input from "./typography-input.gen.ts";
import { iBMPlexMonoMetrics } from "./iBMPlexMonoMetrics.ts";
import { interMetrics } from "./interMetrics.ts";
import { figmaTypographyExtension } from "./figma/figma-typography-extension.ts";

const GOLDEN_RATIO = 1.61803398875;
// 1.61803 (golden ratio) ^ 0.5
const tightLineHeight = input.FontFamilyLineHeightRule.FontSizePxMultipler({ multiplier: Math.pow(GOLDEN_RATIO, 0.5) });
const spaciousLineHeight = input.FontFamilyLineHeightRule.FontSizePxMultipler({ multiplier: GOLDEN_RATIO });

const emojiFontFamilies = ["Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Arial"];

export const typography = input.BaseTypographyInput({
  Extensions: {
    Figma: figmaTypographyExtension,
    Tailwind: {
      TailwindTextClasses: [],
    },
  },
  Families: [
    {
      BaseName: "Inter",
      CSSFontFamilyName: "hnsans",
      CSSFontFamilyFallbacks: ["system-ui", ...emojiFontFamilies, "sans-serif"],
      Metrics: interMetrics,
      DefaultRules: [{ CSS: [{ FontWeight: 400 }], Figma: { FontSuffix: [" Regular", 1] } }],
      Weights: [
        { Weight: 100, FontStyleRule: { CSS: [{ FontWeight: 100 }], Figma: { FontSuffix: [" Thin", 1] } } },
        { Weight: 200, FontStyleRule: { CSS: [{ FontWeight: 200 }], Figma: { FontSuffix: [" Extra Light", 1] } } },
        { Weight: 300, FontStyleRule: { CSS: [{ FontWeight: 300 }], Figma: { FontSuffix: [" Light", 1] } } },
        { Weight: 400, FontStyleRule: { CSS: [{ FontWeight: 400 }], Figma: { FontSuffix: [" Regular", 1] } } },
        { Weight: 500, FontStyleRule: { CSS: [{ FontWeight: 500 }], Figma: { FontSuffix: [" Medium", 1] } } },
        { Weight: 600, FontStyleRule: { CSS: [{ FontWeight: 600 }], Figma: { FontSuffix: [" Semi Bold", 1] } } },
        { Weight: 700, FontStyleRule: { CSS: [{ FontWeight: 700 }], Figma: { FontSuffix: [" Bold", 1] } } },
        { Weight: 800, FontStyleRule: { CSS: [{ FontWeight: 800 }], Figma: { FontSuffix: [" Extra Bold", 1] } } },
        { Weight: 900, FontStyleRule: { CSS: [{ FontWeight: 900 }], Figma: { FontSuffix: [" Black", 1] } } },
      ],
      ItalicOption: { CSS: ["FontStyleItalics"], Figma: { FontSuffix: [" Italic", 2] } },
    },
    {
      // TODO: make these font selectors part of a scalar for Font Family Base ?
      BaseName: "IBM Plex Mono",
      CSSFontFamilyName: "hnmono",
      CSSFontFamilyFallbacks: ["Source Code Pro", ...emojiFontFamilies, "monospace"],
      Metrics: iBMPlexMonoMetrics,
      DefaultRules: [{ CSS: [{ FontWeight: 400 }], Figma: { FontSuffix: [" Regular", 1] } }],
      Weights: [
        { Weight: 100, FontStyleRule: { CSS: [{ FontWeight: 100 }], Figma: { FontSuffix: [" Thin", 1] } } },
        { Weight: 200, FontStyleRule: { CSS: [{ FontWeight: 200 }], Figma: { FontSuffix: [" ExtraLight", 1] } } },
        { Weight: 300, FontStyleRule: { CSS: [{ FontWeight: 300 }], Figma: { FontSuffix: [" Light", 1] } } },
        { Weight: 400, FontStyleRule: { CSS: [{ FontWeight: 400 }], Figma: { FontSuffix: [" Regular", 1] } } },
        { Weight: 500, FontStyleRule: { CSS: [{ FontWeight: 500 }], Figma: { FontSuffix: [" Medium", 1] } } },
        { Weight: 600, FontStyleRule: { CSS: [{ FontWeight: 600 }], Figma: { FontSuffix: [" SemiBold", 1] } } },
        { Weight: 700, FontStyleRule: { CSS: [{ FontWeight: 700 }], Figma: { FontSuffix: [" Bold", 1] } } },
      ],
      ItalicOption: { CSS: ["FontStyleItalics"], Figma: { FontSuffix: [" Italic", 2] } },
    },
  ],
  TextRoles: [
    {
      Token: "content",
      FamilyBaseName: "Inter",
      LineHeightRule: spaciousLineHeight,
      TrackingRule: { DynMetrics: { a: -0.005, b: 0.26, c: -0.17 } },
    },
    {
      Token: "ui",
      FamilyBaseName: "Inter",
      LineHeightRule: tightLineHeight,
      TrackingRule: { DynMetrics: { a: -0.005, b: 0.26, c: -0.17 } },
    },
    {
      Token: "code",
      FamilyBaseName: "IBM Plex Mono",
      LineHeightRule: tightLineHeight,
      TrackingRule: { DynMetrics: { a: -0.005, b: 0.26, c: -0.17 } },
    },
  ],
  FontSizeScale: {
    Equation: input.FontSizeEquation.Multiplier({
      base_px: 12,
      multiplier: Math.sqrt(GOLDEN_RATIO),
    }),
    FontSizes: [
      { Token: "xs", Rel: -2 },
      { Token: "sm", Rel: -1 },
      // Base (12px based on input.FontSizeEquation above)
      { Token: "base", Rel: 0 },
      // Quote
      { Token: "lg", Rel: 1 },
      // h3
      { Token: "xl", Rel: 2 },
      // h2
      { Token: "2xl", Rel: 3 },
      // h1
      { Token: "3xl", Rel: 4 },
      { Token: "4xl", Rel: 5 },
    ],
  },
});
