import { gen, protocol } from "~gen";
import { descriptionKey, descriptionInsertKey } from "./descriptionKey";

let existingStyles = figma.getLocalTextStyles();
const updated: typeof existingStyles = [];
const seenKeys = new Map<string, TextStyle>();
const normalizedByName = new Map<string, TextStyle>();
let tryToMatchNames = true;
const removeBroken = true;
for (const style of existingStyles) {
  const trimmedName = style.name.trim();
  const hasKey = descriptionKey(style);
  if (
    removeBroken &&
    (trimmedName === "" ||
      /^\s*\w+(-\w+)+\s*$/.test(style.description) ||
      (hasKey && seenKeys.has(hasKey)) ||
      normalizedByName.has(getNormalizedName(style)))
  ) {
    style.remove();
  } else {
    if (hasKey) {
      seenKeys.set(hasKey, style);
    }
    if (tryToMatchNames) {
      const norm = getNormalizedName(style);
      const existing = normalizedByName.get(norm);
      if (existing != null) {
        figma.notify(`Cannot normalize names when there is a conflict`, {
          error: true,
        });
        console.error(
          `Conflict between "${style.name}" ~= "${existing.name}"`,
          { style, existing }
        );
        tryToMatchNames = false;
      } else {
        normalizedByName.set(norm, style);
      }
    }
    updated.push(style);
  }
}

function getNormalizedName(opt: { name: string }): string {
  // aggressive normalization
  return removeMarkingFolderFromName(opt.name)
    .replace(/[\s\[\]\(\)\/\-]+/g, " ")
    .trim();
}

if (existingStyles.length !== updated.length) {
  figma.notify(
    `Removed ${existingStyles.length - updated.length} broken text styles`
  );
}

existingStyles.length = 0;
existingStyles = updated;

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
          await updateTextStyles(typography.text_styles);
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
async function updateTextStyles(textStyles: gen.TextStyle[]) {
  const timer = new Timer();
  timer.start("update typography");
  let i = 0;
  const total = textStyles.length;
  figma.notify(`Updating ${total} text styles`);
  let waitToNotifyAt = Date.now() + 1000;
  const unlinkedKeys = new Set(seenKeys.keys());
  const lastTextStylePerFolder = new Map<string, TextStyle>();
  let lastFolderName: string | null = null;
  for (const batch of splitIntoBatches(textStyles, 10)) {
    const styles = await Promise.all(
      batch.map(async (typeStyle) => {
        unlinkedKeys.delete(typeStyle.key);
        const { timer, found } = await importTypeStyle(typeStyle).catch(
          withMessage`Failed to import text style #${i} for ${typeStyle.name}`
        );
        i++;
        // console.log(`Updated Text Style #${i} / ${total}`, timer.timings);
        const now = Date.now();
        if (waitToNotifyAt < now) {
          figma.notify(`Updated Text Style #${i} / ${total}`);
          waitToNotifyAt = now + 1000;
        }
        return found;
      })
    ).catch(withMessage`Failed to import batch of text styles`);

    // ensures the order is consistent
    for (const textStyle of styles) {
      const folderName = getFolderOfNamed(textStyle);
      const lastTextStyle = lastTextStylePerFolder.get(folderName);
      if (lastFolderName != folderName) {
        if (lastFolderName != null) {
          try {
            // TODO: Double check this works
            figma.moveLocalTextFolderAfter(folderName, lastFolderName);
          } catch (err) {
            console.error("failed to move text folder after", {
              target: folderName,
              after: lastFolderName,
            });
          }
          lastFolderName = folderName;
        }
      }
      if (lastTextStyle != null) {
        try {
          figma.moveLocalTextStyleAfter(textStyle, lastTextStyle);
        } catch (err) {
          console.error("failed to move style in same folder", {
            target: textStyle.name,
            after: lastTextStyle.name,
          });
        }
      }
      lastTextStylePerFolder.set(folderName, textStyle);
    }
  }
  timer.start("marking unlinked keys");
  for (const key of Array.from(unlinkedKeys.keys())) {
    const unlinkedStyle = seenKeys.get(key);
    if (unlinkedStyle && !unlinkedStyle.name.startsWith("⚠️ Unlinked")) {
      unlinkedStyle.name =
        "⚠️ Unlinked / " + removeMarkingFolderFromName(unlinkedStyle.name);
    }
  }
  timer.end();

  console.log("Finished updating typography", timer.timings);
}

function removeMarkingFolderFromName(name: string): string {
  return name.replace(/^\s*⚠️[\w\s]+\/\s*/, "");
}

async function importTypeStyle(style: gen.TextStyle) {
  const timer = new Timer();
  timer.start("find existing type style");
  let found = seenKeys.get(style.key);
  if (!found && tryToMatchNames) {
    found = normalizedByName.get(getNormalizedName(style));
  }

  if (found != null) {
    timer.start("update style existing");
    timer.append(await updateStyle(found, style));
  } else {
    timer.start("create style");
    const newStyle = figma.createTextStyle();
    timer.append(await updateStyle(newStyle, style));
    existingStyles.push(newStyle);
    found = newStyle;
  }
  timer.end();
  return { timer, found };
}

class Context {
  fontLoads = new Map<string, Promise<FontName>>();
  loadFont(fontName: FontName): Promise<FontName> {
    const key = fontName.family + "#" + fontName.style;
    const existingP = this.fontLoads.get(key);
    if (existingP) return existingP;
    const loadingP = figma
      .loadFontAsync(fontName)
      .then(() => fontName)
      .catch(async (err) => {
        const corrections = this.autocorrectFontStyle(fontName);
        for (const correction of corrections) {
          try {
            const found = await this.loadFont(correction);
            console.warn(
              `Found ${devStringify(
                fontName
              )}, with a corrected version: ${devStringify(found)}`
            );
            return found;
          } catch (err) {
            // failed to find using a correction...
            console.error(
              `Failed to find ${devStringify(
                fontName
              )} with corrected ${devStringify(correction)}`,
              err
            );
          }
        }
        return Promise.reject(err);
      });
    this.fontLoads.set(key, loadingP);
    return loadingP;
  }

  /**
   * Progress -2/10:
   *  * This is in the completely wrong place.
   *  * Configuration should not require this kind of correction at all.
   *
   * Sometimes "Regular Italic" is not a thing. It's just "Italic"
   * This is a crutch, since we optimally should not have a miss, since that miss is actually
   * not recoverable in all environments (e.g. Tailwind CSS or in runtime generation).
   */
  autocorrectFontStyle(from: FontName): FontName[] {
    return [
      from.style.trim(),
      from.style.replace(/Regular (Italics?)/, "$1").trim(),
    ]
      .filter((newStyle) => newStyle !== "" && newStyle !== from.style)
      .map((style): FontName => ({ family: from.family, style }));
  }
}

const ctx = new Context();
class Timer {
  // constructor(public readonly name: string) {}
  private last?: { name: string; start: number };
  public readonly timings: { name: string; dur: number }[] = [];
  append(other: Timer) {
    this.timings.push(...other.timings);
  }
  start(name: string) {
    const start = this.end();
    this.last = { name, start };
    const self = this;
  }
  end() {
    const now = Date.now();
    if (this.last) {
      this.timings.push({ name: this.last.name, dur: now - this.last.start });
      this.last = undefined;
    }
    return now;
  }
}

async function updateStyle(style: TextStyle, update: gen.TextStyle) {
  const timings = new Timer();
  const fontName: FontName = {
    family: update.family_name_and_style[0],
    style: update.family_name_and_style[1],
  };
  timings.start(`load font ${devStringify(fontName)}`);
  // load font might auto correct the font name...
  const loadedFontName = await ctx
    .loadFont(fontName)
    .catch(withMessage`updating style ${style.name} with update (${update})`);
  timings.start(`set font properties`);
  style.fontName = loadedFontName;
  style.name = update.name;
  style.fontSize = update.font_size_px;
  style.letterSpacing = update.letter_spacing_px
    ? { unit: "PIXELS", value: update.letter_spacing_px }
    : { unit: "PERCENT", value: 0 };
  style.lineHeight = update.line_height_px
    ? { unit: "PIXELS", value: update.line_height_px }
    : { unit: "AUTO" };
  descriptionInsertKey(style, update.key);
  timings.end();
  return timings;
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

function splitIntoBatches<T>(items: T[], perBatch: number): T[][] {
  let result: T[][] = [];
  for (let i = 0; i < items.length; i += perBatch) {
    result.push(items.slice(i, i + perBatch));
  }
  return result;
}

function getFolderOfNamed(item: { name: string }): string {
  return item.name.replace(/^(.+?)[^\/]+$/, "$1").trim();
}
