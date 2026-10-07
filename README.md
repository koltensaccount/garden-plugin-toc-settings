# TOC Settings for Digital Garden

All controls live in Obsidian's **Digital Garden garden plugin menu**. There
are no settings buttons on the published website. Enable or disable this
plugin there, and publish/redeploy after changing settings.

Configure the note-to-TOC buffer, font size, line height, item spacing, nested
heading indentation, maximum height, deepest heading level, title visibility,
and current-heading highlighting. Values are bounded by the runtime to keep
the layout usable. Pane width remains controlled by Resizable Panes.

The garden's own TOC must be enabled for the note. This plugin styles and
filters the existing TOC; it does not generate a second TOC. Works with
Resizable Panes and the garden's mobile sidebar.

## Publish as a separate repository

This folder is the repository root. No build step or dependencies are needed.

```sh
git init -b main
git add .
git commit -m "Initial TOC Settings plugin"
gh repo create garden-plugin-toc-settings --public --source=. --remote=origin --push
```

GitHub CLI must be authenticated. Alternatively, create an empty public repo
on GitHub and push this folder to it. Paste the repository URL into Digital
Garden's **Install from GitHub** control. The manifest is at the required root
path. Future versions should bump `garden-plugin.json` and `package.json`.
The installer prefers the latest GitHub release when one exists, otherwise
the default branch. Install updates through the same garden plugin menu.

## Develop locally

```sh
npm run check
npm run install:garden -- /path/to/my-digital-garden
```

The installation command copies runtime files and preserves existing settings.
Requires a Digital Garden template with garden plugin support and Node 22+.
