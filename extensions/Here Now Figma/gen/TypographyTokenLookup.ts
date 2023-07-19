import * as gen from "./figma-typography-export.gen.js";

export type TokenQueryOutput = {
  properties: gen.TypographyProperty[];
  requiredTokens: Set<string>;
};

// Maybe more of this logic should be in Rust or in Figma?
// Hard to say since we also want to support custom combinations in
// Figma plugin, which require this querying logic to be executed in
// the plugin itself.
export class TypographyTokenLookup {
  constructor(private allTokens: gen.TypographyExport) {}
  query(tokens: string[]): TokenQueryOutput {
    // precedence + props
    const found: [number, { propIdxs: number[]; reqs: string[] }][] = [];
    possible: for (const [reqs, propIdxs] of this.allTokens.tokens) {
      let precedence = -1;
      for (const req of reqs) {
        const idx = tokens.indexOf(req);
        if (idx === -1) {
          continue possible;
        }
        precedence = Math.max(precedence, idx);
      }

      // matched
      found.push([precedence, { propIdxs, reqs }]);
    }

    // todo: might need to collect all unique tokens
    const allProps: gen.TypographyProperty[] = [];
    const allTokens = new Set<string>();
    const byPrecedence = found.sort((a, b) => a[0] - b[0]);
    for (const [_, { propIdxs, reqs }] of byPrecedence) {
      for (const idx of propIdxs) {
        allProps.push(this.allTokens.properties[idx]);
      }
      for (const token of reqs) {
        allTokens.add(token);
      }
    }
    return {
      properties: allProps,
      requiredTokens: allTokens,
    };
  }
}

export function testHarness(tokens: gen.TypographyExport) {
  const lookup = new TypographyTokenLookup(tokens);
  return {
    query(tokens: TemplateStringsArray) {
      const tokensTrimmed = splitTokens(String.raw(tokens));
      console.log(tokensTrimmed.join(", "), lookup.query(tokensTrimmed));
    },
  };
}

const SPLIT_RE = /[,\s]+/g;
export function splitTokens(x: string): string[] {
  const trimmed = x.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(SPLIT_RE);
}
