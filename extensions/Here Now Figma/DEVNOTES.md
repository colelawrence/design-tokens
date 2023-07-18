I tried using 
```json
  "build": "zsh -c 'node build.cjs'",
```

as part of my manifest, but it led to a continuously blinking UI?
This can be avoided by either disabling "hot reload figma ui", or by not writing the files if they are unchanged.
I don't know if one is better than the other.


Run dev mode with either `cargo xtask extension-figma-here-now-dev` or some version of `watchexec -w ui-src 'npm run build'`.
