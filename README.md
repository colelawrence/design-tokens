# design-tokens

Maintain design tokens between multiple different languages and environments.

See [our dev notes for getting started in the codebase](./DEVELOPING.md).

### Motivation
 
Learn more about color science and typography while delivering a valuable tool for synchronizing design tokens across ecosystems.
Contribute another tool for correct/precise design system maintenance to the Rust ecosystem
(I know most tools are in TypeScript, but I have major TypeScript/JavaScript package management fatigue)
The initial environments I need this for include a custom loaded Tailwind CSS plugin, Figma plugin which updates Text Styles and Color Variables, and eventually Slint-UI widgets.

### 🧑‍🤝‍🧑 Target audience

 
Small-to-medium sized (5-30 contributor) teams with a product with strong needs for themability
Determined Rust nerds who want to use Rust for as much of their Design Ops tooling as possible

## Project Overview
 
The MVP is a simple JSON-in JSON-out library which can be made into a CLI or WASM module to load in browser, nodejs, etc.
JSON-inputs define two kinds of rule-sets including the "tokens" set, then the "selection" set.
Some systems like TailwindCSS can use all tokens together, while some softwares like Figma's Text Styles require many tokens are grouped together.
Most of the project is in Rust with end-user configuration passed in with JSON (via deno / node / Rust)
The tooling validates the configuration of design token groups to generate appropriate configurations for a Tailwind Plugin and a Figma Plugin.


### About colors
 
I'm currently generating a base palette with the Material 3 Color System.

My initial feelings are that colors require a lot of expressivity and bring a lot of personality into a product, and depending on the type of project, the colors are needed in different ratios (e.g. a news publication versus a data-entry tool). Because of this, the long term may involve breaking down color generation into different phases of "defining colors" and "color scales".

 * "Defining colors" are the source colors for brand colors (primary and support for example), color roles (secondary, tertiary, error, surface for example), and so forth.
 * "Color scales" are the colors scaled consistently across different perceived brightnesses using a chosen color-space.

I want to both enable the generation of all these colors from a few source colors (like in Material You's color theming generation) and enable just automating the generation of the color scales and color-blind friendly variants. In other words, the design system owner can bring a few colors with them or many colors and by using this tooling, we can cut down on the tedium.

Some initial thoughts about color spaces.

 * Use a color-space like [Oklab](https://bottosson.github.io/posts/oklab/) for brightness/value (and for interpolation if necessary)
 * Use a color-space like [HCT from Material 3](https://material.io/blog/science-of-color-design) for pallette generation and navigation.

I would like to entertain how we could extend this somewhat generic system to accept more kinds of design system coloring palette approaches.

### About typography
 
A big part of my motivation has been to make it easier to generate typography size scales which respect optical sizing [see "Font size is useless; let’s fix it" by Tonsky](https://tonsky.me/blog/font-size/) and which have pixel aligned caps or xs (see [Capsize CSS](https://seek-oss.github.io/capsize/) for more info)
This in combination with allowing tracking (letter-spacing) configuration with [Dynamic Metrics](https://rsms.me/inter/dynmetrics/), means we may be able to make it really easy to empower everyone to create legible, yet customizable, typography.

### About lengths/borders/box shadows/motion designs:

I do not know, yet. But, I'm happy to collaborate with someone who wants to design something for these kinds of tokens.
