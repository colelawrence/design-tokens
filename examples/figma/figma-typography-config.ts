import * as input from "../typography-input.gen.ts";

console.warn("Using figma-config.ts");

const figmaWeights: input.FigmaTextStyleMatrixOption[] = [
  { Name: "Thin", Tokens: "weight:100" },
  { Name: "Extra Light", Tokens: "weight:200" },
  { Name: "Light", Tokens: "weight:300" },
  { Name: "Regular", Tokens: "weight:400" },
  { Name: "Medium", Tokens: "weight:500" },
  { Name: "Semi Bold", Tokens: "weight:600" },
  { Name: "Bold", Tokens: "weight:700" },
  { Name: "Extra Bold", Tokens: "weight:800" },
  { Name: "Black", Tokens: "weight:900" },
];

const figmaWeightsAlters = input.FigmaTextStyleMatrixGroup({
  NamePrefix: " ",
  IncludeEmptyOption: true,
  Options: figmaWeights,
});

const figmaWeightsBase = input.FigmaTextStyleMatrixGroup({
  Options: figmaWeights,
});

const figmaItalicGroup = input.FigmaTextStyleMatrixGroup({
  Description: "Font italicized",
  IncludeEmptyOption: true,
  NamePrefix: " ",
  Options: [{ Name: "Italic", Tokens: "italic:true" }],
});
const figmaProseStyleGroup = input.FigmaTextStyleMatrixGroup({
  Description: "Prose stylization",
  IncludeEmptyOption: true,
  NamePrefix: " (",
  NameSuffix: ")",
  Options: [{ Name: "Code", Tokens: "role:code", Key: "code" }],
});

export const figmaTypographyConfig = input.FigmaTypographyConfig({
  FigmaTextStyles: [
    {
      BaseName: "Content",
      BaseTokens: "role:content",
      BaseKey: "content",
      Groups: [
        {
          Options: [
            { Name: "XS", Tokens: "size:xs" },
            { Name: "SM", Tokens: "size:sm" },
            { Name: "Base", Tokens: "size:base" },
            { Name: "Quote", Tokens: "size:lg weight:600", Key: "quote" },
            { Name: "H3", Tokens: "size:lg weight:700", Key: "h3", Description: "Use gray color" },
            { Name: "H2", Tokens: "size:xl weight:700", Key: "h2" },
            { Name: "H1", Tokens: "size:2xl weight:700", Key: "h1" },
            { Name: "Title 3XL", Tokens: "size:3xl weight:700", Key: "title-3xl" },
            { Name: "Title 4XL", Tokens: "size:4xl weight:700", Key: "title-4xl" },
          ],
        },
        figmaWeightsAlters,
        figmaProseStyleGroup,
        figmaItalicGroup,
      ],
    },
    {
      BaseName: "UI",
      BaseTokens: "role:ui",
      BaseKey: "ui",
      Groups: [
        {
          Description: "text size",
          Options: [
            { Name: "Smaller", Tokens: "size:xs" },
            { Name: "Small", Tokens: "size:sm" },
            { Name: "Base", Tokens: "size:base" },
            { Name: "Large", Tokens: "size:lg" },
            { Name: "Larger", Tokens: "size:xl" },
            // Add 2X if you like.
            { Name: "3X Large", Tokens: "size:3xl" },
          ],
        },
        figmaWeightsAlters,
        figmaProseStyleGroup,
        figmaItalicGroup,
      ],
    },
    {
      BaseName: "Codeblock",
      BaseTokens: "role:code size:base",
      BaseKey: "codeblock",
      Groups: [figmaWeightsBase, figmaItalicGroup],
    },
  ],
});
