import { figmaTypographyExtension } from "./figma-typography-extension.ts";

const h = harness(allTokensSampleData);
h.query`W100 mono`;
h.query`W100 text content W200 xs`;
h.query`text content base quote W800`;
/*
W100, text, content, W200, xs [
  { FontStyle: { CSS: null, Figma: null } },
  { FontFamily: { family_name: "Inter" } },
  { FontStyle: { CSS: null, Figma: null } },
  { FontSize: { px: 10.197560814372599 } },
  { LetterSpacing: { px: 0.04092898010051371 } },
  { LineHeight: { px: 16.499999999999993 } }
]
*/

for (const textStyle of figmaTypographyExtension.FigmaTextStyles) {
  let allTextStyles: {
    names: string[];
    /** split and flattened */
    tokens: string[];
  }[] = [{ names: [textStyle.BaseName], tokens: splitTokens(textStyle.BaseTokens) }];
  for (const group of textStyle.Groups) {
    const originalTextStyles = allTextStyles;
    allTextStyles = new Array(originalTextStyles.length * group.Options.length);
    let i = 0;
    for (const original of originalTextStyles) {
      for (const option of group.Options) {
        allTextStyles[i] = {
          names: [...original.names, option.Name],
          tokens: [...original.tokens, ...splitTokens(option.Tokens)],
        };
        i++;
      }
    }
  }

  const len = allTextStyles.length;
  const figmaTextStyles: any[] = new Array(len);
  const lookup = new TypographyTokenLookup(allTokensSampleData);
  for (let i = 0; i < len; i++) {
    const textStyle = allTextStyles[i];
    figmaTextStyles[i] = {
      name: textStyle.names.join("/"),
      props: lookup.query(textStyle.tokens),
    };
  }

  console.log(figmaTextStyles)
}
