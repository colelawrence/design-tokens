import { gen, protocol } from "~gen";

const existingStyles = figma.getLocalTextStyles();

figma.showUI(__html__, {
  width: 500,
  height: 500,
  themeColors: true,
});

function sendToUI(message: protocol.MessageToUI) {
  figma.ui.postMessage(message);
}

figma.ui.onmessage = (e) => {
  protocol.MessageToPlugin.match(e, {
    Command(inner) {
      gen.FigmaPluginCommandOperation.match(inner.command.figma_plugin, {
        async UpdateTypography(typography) {
          let i = 0;
          const total = typography.text_styles.length
          for (const typeStyle of typography.text_styles) {
            i++;
            await importTypeStyle(typeStyle).catch(
              withMessage`Failed to import text style #${i} for ${typeStyle.name}`
            );
            figma.notify(`Updated Text Style #${i} / ${total}`);
          }
        },
      })
        .then(() => {
          figma.closePlugin("Successfully updated typography");
        })
        .catch((err) => {
          figma.notify("Failed to execute command");
          console.error(
            "Error executing command",
            Object.keys(inner.command.figma_plugin)[0],
            err
          );
        });
    },
    ImportJSONFileToVariables(inner) {
      console.warn("TODO: importing JSON file to variables", inner);
    },
  });
};

async function importTypeStyle(style: gen.TextStyle) {
  const stylesLen = existingStyles.length;
  let found: TextStyle | null = null;
  for (let i = 0; i < stylesLen; i++) {
    const existing = existingStyles[i];
    if (
      descriptionHasKey(existing, style.key) ||
      existing.name.toLowerCase() === style.name.toLowerCase()
    ) {
      found = existing;
      break;
    }
  }

  if (found != null) {
    await updateStyle(found, style);
  } else {
    const newStyle = figma.createTextStyle();
    await updateStyle(newStyle, style);
    existingStyles.push(newStyle);
  }
}

class Context {
  fontLoads = new Map<string, Promise<void>>();
  loadFont(fontName: FontName) {
    const key = fontName.family + "#" + fontName.style;
    const existingP = this.fontLoads.get(key);
    if (existingP) return existingP;
    const loadingP = figma.loadFontAsync(fontName);
    this.fontLoads.set(key, loadingP);
    return loadingP;
  }
}

const ctx = new Context();

async function updateStyle(style: TextStyle, update: gen.TextStyle) {
  const fontName: FontName = { family: update.family_name_and_style[0], style: update.family_name_and_style[1] };
  await ctx
    .loadFont(fontName)
    .catch(withMessage`updating style ${style.name} with update (${update})`);
  style.fontName = fontName;
  style.name = update.name;
  style.fontSize = update.font_size_px;
  style.letterSpacing = update.letter_spacing_px
    ? { unit: "PIXELS", value: update.letter_spacing_px }
    : { unit: "PERCENT", value: 0 };
  style.lineHeight = update.line_height_px
    ? { unit: "PIXELS", value: update.line_height_px }
    : { unit: "AUTO" };
  descriptionInsertKey(style, update.key);
  figma.createTextStyle();
}

function descriptionHasKey(
  opts: { description: string },
  key: string
): boolean {
  return opts.description.includes(`(#${key}#)`); // v0
}

function descriptionInsertKey(opts: { description: string }, key: string) {
  let updated = opts.description.replace(/(\s*)\(#[^#]+#\)/, "");
  updated = updated.trimEnd();
  if (updated.length) {
    updated += " ";
  }
  updated += `(#${key}#)`;
  opts.description = updated;
}

function withMessage(
  templ: TemplateStringsArray,
  ...args: any[]
): (err: unknown) => Promise<never> {
  return (err) =>
    Promise.reject(
      new Error(
        `${String.raw(templ, ...args.map(devStringify))}: ${devStringify(err)}`
      )
    );
}

function devStringify(x: any): string {
  return x instanceof Error
    ? x.toString()
    : JSON.stringify(x)
        .replace(/"([^"\\]+)":/g, "$1:")
        .replace(/\\"/g, '"');
}
