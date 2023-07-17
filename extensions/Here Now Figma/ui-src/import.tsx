import "./shared.css";
import { Subscription } from "rxjs";
import { renderSpec } from "jsx-view";

try {
  const rootSub = new Subscription();

  const appJsx = (
    <form>
      <div class="row">
        <select id="collectionSelect"></select>
        <input
          placeholder="Collection Name"
          required
          type="text"
          id="collectionInput"
        />
      </div>

      <div class="row">
        <select id="modeSelect"></select>
        <input placeholder="Mode Name" required type="text" id="modeInput" />
      </div>
      <textarea required placeholder="Tokens JSON" />
      <button type="submit">Import Variables</button>
    </form>
  );

  document.getElementById("app-root")!.appendChild(renderSpec(rootSub, appJsx));
} catch (err) {
  console.error(err);
}
