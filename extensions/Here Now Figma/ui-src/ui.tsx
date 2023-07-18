import "./shared.css";
import { Subscription, map } from "rxjs";
import { renderSpec } from "jsx-view";
import {
  NavButtonState,
  RootMode,
  UpdateJSONMode,
  createUIState,
} from "./createUIState";

function RootUI(root: RootMode) {
  return <h1>Home</h1>;
}

function UpdateJSONUI(updateJSON: UpdateJSONMode) {
  return <h1>UpdateJSON</h1>;
}

try {
  const rootSub = new Subscription();
  const state = createUIState(rootSub);

  const appJsx = (
    <div>
      {state.mode$.pipe(
        map((mode) =>
          mode.name === "root" ? (
            RootUI(mode)
          ) : mode.name === "update-json" ? (
            UpdateJSONUI(mode)
          ) : (
            <span>UI State not found</span>
          )
        )
      )}
      <div class="row">
        <NavButton label="Home" state={state.nav.home} />
        <NavButton label="Update" state={state.nav.update} />
      </div>
    </div>
  );

  document.getElementById("app-root")!.appendChild(renderSpec(rootSub, appJsx));
} catch (err) {
  console.error(err);
}

function NavButton(props: { state: NavButtonState; label: string }) {
  return (
    <button disabled={props.state.isOpen$} onclick={() => props.state.open()}>
      {props.label}
    </button>
  );
}
