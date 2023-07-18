import { fromEvent, map } from "rxjs";
import type {
  ButtonState,
  NavButtonState,
  NavState,
  RootMode,
  UIInput,
  UIState,
  UpdateJSONMode,
} from "../state/createUIState";
import "./shared.css";

const debug = false;

function RootUI(root: RootMode) {
  return <h1>Home</h1>;
}

function UpdateJSONUI(updateJSON: UpdateJSONMode) {
  return (
    <div class="flex flex-col flex-1 gap">
      <TextArea input={updateJSON.jsonTextarea} />
      <div class="flex gap justify-end">
        <div class="error-message">{updateJSON.error$}</div>
        <Button class="btn-secondary" state={updateJSON.resetBtn} />
        <Button state={updateJSON.submitBtn} />
      </div>
      {debug ? <pre>{updateJSON.jsonTextarea.value$}</pre> : null}
    </div>
  );
}

export function AppRoot({ state }: { state: UIState }) {
  return (
    <div class="flex flex-col flex-1 gap">
      {navJsx(state.nav)}
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
    </div>
  );
}

function navJsx(nav: NavState) {
  return (
    <div class="flex gap">
      <NavButton label="Home" state={nav.home} />
      <NavButton label="Update" state={nav.update} />
    </div>
  );
}

function NavButton(props: { state: NavButtonState; label: string }) {
  return (
    <button
      disabled={props.state.isOpen$}
      onclick={() => props.state.open()}
      class="flex-1"
      style={{
        backgroundColor: props.state.isOpen$.pipe(
          falseyThen(`var(--figma-color-bg)`)
        ),
      }}
    >
      {props.label}
    </button>
  );
}

function Button(props: { class?: string; state: ButtonState }) {
  return (
    <button
      disabled={props.state.disabled$}
      onclick={() => props.state.click()}
      class={props.class}
    >
      {props.state.label$}
      {props.state.label}
    </button>
  );
}

function TextArea(props: { input: UIInput }) {
  return (
    <textarea
      style={{ resize: "vertical" }}
      ref={(textarea, sub) => {
        sub.add(
          props.input.value$.subscribe((value) => {
            textarea.value = value;
          })
        );
        sub.add(
          fromEvent(textarea, "input").subscribe((update) => {
            props.input.update(textarea.value);
          })
        );
      }}
    />
  );
}

function truthyThen(value: string) {
  return map((test: unknown) => (test ? value : ""));
}
function falseyThen(value: string) {
  return map((test: unknown) => (test ? "" : value));
}
