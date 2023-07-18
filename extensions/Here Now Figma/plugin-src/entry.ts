import { protocol } from "~gen";

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
    ImportJSONFileToVariables(inner) {
      console.warn("TODO: importing JSON file to variables", inner);
    },
  });
};
