import { BehaviorSubject, Observable, Subscription, map } from "rxjs";
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
export function createUIState(rootSub: Subscription): UIState {
  const $mode$ = new BehaviorSubject<Mode>(createUpdateJSONMode());
  function sendToPlugin(message: protocol.MessageToPlugin) {
    parent.postMessage({ pluginMessage: message }, "*");
  }

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
          $mode$.next(createUpdateJSONMode());
        },
      },
    },
  };
}

function parseJSON(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, message: "Value is empty" };
  try {
    const value = JSON.parse(trimmed);
    try {
      const command = gen.FigmaPluginCommand(value);
      return gen.FigmaPluginCommandOperation.match(command.figma_plugin, {
        UpdateTypography() {
          return { ok: true, message: "Update Typography", value };
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

function createUpdateJSONMode(): UpdateJSONMode {
  const $json$ = new BehaviorSubject("");
  const checked$ = $json$.pipe(map(parseJSON));

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
        console.warn("must update typography");
      },
      disabled$: checked$.pipe(map((v) => !v.ok)),
      label$: checked$.pipe(map((v) => (v.ok ? v.message : "Submit"))),
    },
  };
}
