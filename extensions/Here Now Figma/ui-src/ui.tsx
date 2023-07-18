import { Subscription } from "rxjs";
import { createUIState } from "./state/createUIState";
import { AppRoot } from "./view/app-root";
import { renderSpec } from "jsx-view";

try {
  const rootSub = new Subscription();
  const state = createUIState(rootSub);
  document
    .getElementById("app-root")!
    .appendChild(renderSpec(rootSub, <AppRoot state={state} />));
} catch (err) {
  console.error("Error setting up UI for Figma Plugin", err);
}
