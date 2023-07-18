import { BehaviorSubject, Observable, Subscription, map } from "rxjs";
import { protocol } from "~gen";

export interface RootMode {
  name: "root";
}
export interface UpdateJSONMode {
  name: "update-json";
}
type Mode = UpdateJSONMode | RootMode;
export type NavButtonState = {
  open(): void;
  isOpen$: Observable<boolean>;
};

type UIState = {
  mode$: Observable<Mode>;
  nav: {
    home: NavButtonState;
    update: NavButtonState;
  };
};
export function createUIState(rootSub: Subscription): UIState {
  const $mode$ = new BehaviorSubject<Mode>({
    name: "root",
  });
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
          $mode$.next({
            name: "update-json",
          });
        },
      },
    },
  };
}
