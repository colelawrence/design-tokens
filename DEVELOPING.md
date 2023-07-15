# Developing on `design-tokens`

## Codebase dependencies and setup philosophy

The codebase is a "Rust" focused codebase, but we should use ecosystem appropriate languages for extensions into other platforms (i.e. TypeScript + NPM for Tailwind CSS plugins and Figma Plugins, C# for Unity, and so on).

It would be really awesome for anyone to be able to immediately start contributing if they only run a cargo command.

## Setting up the codebase

```sh
# Clone in all the submodules
# Rust cannot be built without some of our vendored code
# which is submoduled in so we can easily update it with tweaks
git submodule update --recursive --init
```

## Codebase scripts

Any automatable action should be configured as part of [our xtasks](./xtask/src/main.rs) with [the xtask pattern](https://github.com/matklad/cargo-xtask). Where you would have setup `package.json` `"scripts"`, we use xtask as a cross-platform approach to codebase automations and maintenance tasks.

```sh
cargo xtask --help # List out the available xtask commands
cargo xtask fix-code # lint fixes
cargo xtask doc-code # generate and show docs
```
