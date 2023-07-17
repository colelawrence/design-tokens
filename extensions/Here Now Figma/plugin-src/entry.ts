if (figma.command === "import") {
  figma.showUI(__uiFiles__["import"], {
    width: 500,
    height: 500,
    themeColors: true,
  });
  // TODO:
  // getExistingCollectionsAndModes();
  // which will send messages to the other side to show the
  // available collections and such.
} else if (figma.command === "autocorrect") {
  figma.showUI(__uiFiles__["autocorrect"], {
    width: 500,
    height: 500,
    themeColors: true,
  });
}
