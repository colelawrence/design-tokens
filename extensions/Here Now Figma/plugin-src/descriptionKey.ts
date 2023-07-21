function descriptionHasKey(
  opts: { description: string },
  key: string
): boolean {
  return descriptionKey(opts) === key; // v0
}
const DESCRIPTION_RE_V0 = /\s*\(#(#?[\w:]+(?:-#?[\w:]+)+)#\)/;
const DESCRIPTION_RE_V1 = /\s*\(\(([^\)]+)\)\)/g;

export function descriptionKey(opts: { description: string }): null | string {
  const found1 = DESCRIPTION_RE_V1.exec(opts.description);
  if (found1) return found1[1];
  const found = DESCRIPTION_RE_V0.exec(opts.description);
  if (found) return found[1];
  return null;
}

export function descriptionInsertKey(
  opts: { description: string },
  key: string
) {
  let updated = opts.description
    .replace(DESCRIPTION_RE_V1, "")
    .replace(DESCRIPTION_RE_V0, "");
  updated = updated.trimEnd();
  if (updated.length) {
    updated += "\n\n";
  }
  updated += `((${key}))`;
  opts.description = updated;
}
