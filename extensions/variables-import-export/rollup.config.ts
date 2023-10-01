import * as fs from 'node:fs/promises';
import type {ChildProcessByStdio} from 'node:child_process';
import child_process from 'node:child_process';
import path from 'node:path';
import sveltePreprocess from 'svelte-preprocess';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import svg from 'rollup-plugin-svg';
import typescript from '@rollup/plugin-typescript';

/* Post CSS */
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

/* Inline to single html */
import type {OutputChunk, Plugin, RollupOptions} from 'rollup';

const production = !process.env.ROLLUP_WATCH;

const uiPages = {
  'src/ui/import.ts': 'dist/import.html',
  'src/ui/export.ts': 'dist/export.html',
};

const mainEntry = {
  input: 'src/code.ts',
  output: {
    file: 'dist/code.js',
    format: 'iife',
    name: 'code',
    sourcemap: !production,
    globals: {
      this: 'self',
    },
  },
  plugins: [
    del({targets: 'dist/*'}),
    typescript({
      sourceMap: !production,
    }),
    copy({
      targets: [{src: 'manifest.json', dest: 'dist'}],
    }),
    resolve({
      browser: true,
      dedupe: (importee) =>
        importee === 'svelte' || importee.startsWith('svelte/'),
      extensions: ['.svelte', '.mjs', '.js', '.json', '.node'],
    }),
    commonjs(),
    production && terser(),
  ],
};

export default [mainEntry, ...getUIPagesConfig()];

function getUIPagesConfig(): RollupOptions[] {
  return Object.entries(uiPages).map(([input, target]) => ({
    input,
    output: {
      file: target,
      format: 'iife',
      name: 'ui',
      sourcemap: !production,
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({sourceMap: !production}),
        compilerOptions: {
          dev: !production,
        },
      }),
      resolve({
        browser: true,
        dedupe: (importee) =>
          importee === 'svelte' || importee.startsWith('svelte/'),
        extensions: ['.svelte', '.mjs', '.js', '.json', '.node'],
      }),
      commonjs(),
      svg(),
      postcss({
        extensions: ['.css'],
        plugins: [cssnano()],
      }),
      cleanup({
        extensions: ['html', 'js', 'ts'],
      }),
      htmlBundle({
        template: 'src/template.html',
        target,
      }),
      !production && serve(),

      // Watch the `dist` directory and refresh the
      // browser on changes when not in production
      !production && livereload('dist'),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
  }));
}

function htmlBundle({
  template,
  target,
}: {
  template: string;
  target: string;
}): Plugin {
  return {
    name: 'html-bundle',
    writeBundle: async (_options, bundle) => {
      let inject = '';

      const templateContent = await fs.readFile(path.resolve(template), 'utf8');
      const targetIndex = templateContent.lastIndexOf('</body>');
      if (targetIndex === -1) {
        throw new Error('Template file does not have body element');
      }

      Object.values(bundle).forEach((module: OutputChunk) => {
        inject += `<script>\n${module.code}</script>\n`;
      });

      const bundledContent =
        templateContent.substring(0, targetIndex) +
        inject +
        templateContent.substring(targetIndex);
      await fs.writeFile(path.resolve(target), bundledContent);
    },
  };
}

// Keep a reference to a spawned server process
let server: ChildProcessByStdio<null, null, null>;

function serve() {
  function toExit() {
    // Kill the server if it exists
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      // Spawn a child server process
      server = child_process.spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      // Kill the server on process termination or exit
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}
