import "./shared.css";
import { Subscription } from "rxjs";
import { renderSpec } from "jsx-view";
import { protocol } from "~gen";

try {
  const rootSub = new Subscription();

  const appJsx = (
    <form
      onsubmit={() => {
        sendToPlugin(
          protocol.MessageToPlugin.ImportJSONFileToVariables({
            selected_collection_id: protocol.IDOrNew.NewWithName("Test"),
            selected_mode_id: protocol.IDOrNew.NewWithName("Test"),
            json: { hmm: "message" },
          })
        );
      }}
    >
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

function sendToPlugin(message: protocol.MessageToPlugin) {
  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}

window.onmessage = (event) => {
  protocol.MessageToUI.match(event.data.pluginMessage, {
    LoadCollections(inner) {
      console.log("Load collections", { inner });
    },
  });
};
