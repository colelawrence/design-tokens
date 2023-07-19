<script lang="ts">
  import './app.css';

  window.onmessage = ({data: {pluginMessage}}) => {
    if (pluginMessage.type === 'EXPORT_RESULT') {
      document.querySelector('textarea').innerHTML = pluginMessage.files
        .map(
          ({fileName, body}) =>
            `/* ${fileName} */\n\n${JSON.stringify(body, null, 2)}`,
        )
        .join('\n\n\n');
    }
  };

  function exportVariables() {
    parent.postMessage({pluginMessage: {type: 'EXPORT'}}, '*');
  }
</script>

<main>
  <button id="export" on:click={exportVariables} type="button">
    Export Variables Test
  </button>
  <textarea placeholder="Exported variables will render here..." readonly
  ></textarea>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }

  button {
    appearance: none;
    border-radius: 4px;
    padding: var(--spacing);
  }

  textarea {
    background-color: var(--figma-color-bg-secondary);
    border: 2px solid var(--figma-color-border);
    color: var(--figma-color-text-secondary);
    flex: 1;
    font-family:
      Andale Mono,
      monospace;
    font-size: 0.9rem;
    overflow: auto;
    padding: var(--spacing);
    white-space: pre;
  }
  textarea:focus {
    border-color: var(--figma-color-border-selected);
    outline: none;
  }

  button,
  textarea {
    display: block;
    width: 100%;
  }

  button {
    background-color: var(--figma-color-bg-brand);
    border: none;
    color: var(--figma-color-text-onbrand);
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Open Sans',
      'Helvetica Neue',
      sans-serif;
    font-weight: bold;
  }

  #export {
    background-color: var(--figma-color-bg-component);
  }
</style>
