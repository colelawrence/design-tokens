const watch = process.argv.includes("--watch");

const esbuild = require("esbuild");
const { htmlPlugin } = require("@craftamap/esbuild-plugin-html");

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="app-root"></div>
</body>
</html>`;

const builds = [
  {
    name: "dist/plugin.js",
    ctx: esbuild.context({
      bundle: true,
      outfile: "dist/plugin.js",
      tsconfig: "plugin-src/tsconfig.json",
      entryPoints: ["plugin-src/plugin.ts"],
      target: "ES2019", // If QuickJS doesn't support, then continue lowering this.
    }),
  },
  {
    name: "dist/ui.html",
    ctx: esbuild.context({
      bundle: true,
      entryPoints: ["ui-src/ui.tsx"],
      tsconfig: "ui-src/tsconfig.json",
      target: "ES2020",
      platform: "browser",
      metafile: true,
      outdir: "dist/",
      plugins: [
        htmlPlugin({
          files: [
            {
              entryPoints: ["ui-src/ui.tsx"],
              filename: "ui.html",
              inline: { css: true, js: true },
              htmlTemplate,
            },
          ],
        }),
      ],
    }),
  },
];

for (const build of builds) {
  build.ctx
    .then((ctx) => {
      if (watch) {
        console.log(`Watching for ${build.name}.`);
        return ctx.watch();
      } else {
        return ctx.rebuild().then((result) => {
          if (result.errors.length || result.warnings.length) {
            console.warn(`${build.name}`);
            console.warn(result);
          } else {
            console.log(`Built ${build.name}.`);
          }
          return ctx.dispose();
        });
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
