import * as output from "../output.gen.ts";

const out = output.TypographyExport(JSON.parse(Deno.args.findLast(Boolean)!));

console.error(out);

console.log(JSON.stringify({ not_implemented: true }));
