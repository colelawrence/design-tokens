import "./shared.css";
import { Subscription } from "rxjs";
import { renderSpec } from "jsx-view";

try {
  const rootSub = new Subscription();

  const appJsx = (
    <form>
      <h1>Autocorrect</h1>
      <p>Give suggestions for correcting all children of the selection</p>
      <button type="submit">Show suggestions</button>
    </form>
  );

  document.getElementById("app-root")!.appendChild(renderSpec(rootSub, appJsx));
} catch (err) {
  console.error(err);
}
