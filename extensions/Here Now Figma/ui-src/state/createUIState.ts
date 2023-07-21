import { BehaviorSubject, Observable, Subscription, map, take } from "rxjs";
import { gen, protocol } from "~gen";

export interface RootMode {
  name: "root";
}
export type UIInput = {
  value$: Observable<string>;
  update(newValue: string): void;
};

export interface UpdateJSONMode {
  name: "update-json";
  jsonTextarea: UIInput;
  error$: Observable<string | null>;
  resetBtn: ButtonState;
  submitBtn: ButtonState;
}

type Mode = UpdateJSONMode | RootMode;
export type NavButtonState = {
  open(): void;
  isOpen$: Observable<boolean>;
};
export type ButtonState = {
  click(): void;
  disabled$?: Observable<boolean>;
  label?: string;
  label$?: Observable<string>;
};

export type NavState = {
  home: NavButtonState;
  update: NavButtonState;
};

export type UIState = {
  mode$: Observable<Mode>;
  nav: NavState;
};
interface Services {
  sendToPlugin(message: protocol.MessageToPlugin): void;
}

export function createUIState(rootSub: Subscription): UIState {
  const services: Services = {
    sendToPlugin(message) {
      parent.postMessage({ pluginMessage: message }, "*");
    },
  };
  const $mode$ = new BehaviorSubject<Mode>(createUpdateJSONMode(services));

  window.onmessage = (event) => {
    protocol.MessageToUI.match(event.data.pluginMessage, {
      LoadCollections(inner) {
        console.log("Load collections", { inner });
      },
    });
  };

  return {
    mode$: $mode$.asObservable(),
    nav: {
      home: {
        isOpen$: $mode$.pipe(map((mode) => mode.name === "root")),
        open() {
          $mode$.next({
            name: "root",
          });
        },
      },
      update: {
        isOpen$: $mode$.pipe(map((mode) => mode.name === "update-json")),
        open() {
          $mode$.next(createUpdateJSONMode(services));
        },
      },
    },
  };
}

function parseFigmaPluginJSON(
  value: string
):
  | { ok: false; message: string }
  | { ok: true; message: string; command: gen.FigmaPluginCommand } {
  const open = "####BEGIN:FIGMA PLUGIN COMMAND####";
  const close = "####END:FIGMA PLUGIN COMMAND####";
  let trimmed = value.trim();
  if (!trimmed) return { ok: false, message: "Value is empty" };
  const openIndex = trimmed.indexOf(open);
  const closeIndex = trimmed.indexOf(close);

  if (openIndex === -1 || closeIndex === -1 || openIndex >= closeIndex) {
    return {
      ok: false,
      message: `Input does not have a Figma plugin command (it doesn't have the expected \"####\" boundaries)`,
    };
  }

  trimmed = trimmed.slice(openIndex + open.length, closeIndex).trim();

  try {
    const value = JSON.parse(trimmed);
    try {
      const command = gen.FigmaPluginCommand(value);
      return gen.FigmaPluginCommandOperation.match(command.figma_plugin, {
        UpdateTypography() {
          return { ok: true, message: "Update Typography", command };
        },
      });
    } catch (err) {
      return {
        ok: false,
        message:
          "Unknown: This JSON does not appear to have come from design-tokens.",
      };
    }
  } catch (err) {
    return { ok: false, message: "Invalid JSON" };
  }
}

function createUpdateJSONMode(services: Services): UpdateJSONMode {
  const $json$ = new BehaviorSubject("");
  const checked$ = $json$.pipe(map(parseFigmaPluginJSON));

  return {
    name: "update-json",
    jsonTextarea: {
      update(newValue) {
        $json$.next(newValue);
      },
      value$: $json$.asObservable(),
    },
    error$: checked$.pipe(map((c) => (c.ok ? null : c.message))),
    resetBtn: {
      click() {
        $json$.next("");
      },
      disabled$: $json$.pipe(map((v) => v === "")),
      label: "Reset",
    },
    submitBtn: {
      click() {
        checked$.pipe(take(1)).subscribe((checked) => {
          if (checked.ok) {
            services.sendToPlugin(
              protocol.MessageToPlugin.Command({
                command: checked.command,
              })
            );
          } else {
            console.error("submitted erroneous value", checked);
          }
        });
      },
      disabled$: checked$.pipe(map((v) => !v.ok)),
      label$: checked$.pipe(map((v) => (v.ok ? v.message : "Submit"))),
    },
  };
}
