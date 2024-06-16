# ZeroBee

A "zero build" documentation platform

ZeroBee is an experiment to create an [MkDocs](https://www.mkdocs.org/)-like system where file processing and site creation happens entirely within the browser. ZeroBee will take markdown documents and create a static, singe-page, site instantly, without any prerequistie build process.

## How to use

### Basic setup
On your web server, from a directory where traffic is served:
- Copy the "scaffolder page" (`dist/index.html`) into the directory
- Create a sub-directory names `docs` for your markdown documents
- Create a config (`zb.json`) for the site
    - See `examples/zb.json` to see how this should be structured

### Custom themes
Sites can be customized with a custom theme, which is simply a CSS stylesheet that add to or overrides the core styles that are defined.

To create a custom theme:

- In the directory with `zb.json`:
    - Create a CSS file `themes/<NAME>/styles.css`, where `<NAME>` is some name to identify the theme
    - Add styles to the `styles.css` file
- Within `zb.json`, add a field to indicate a custom theme is to be used:
    - `"theme": "<NAME>"`



## Why?
As web clients continue to get more powerful, compute that was traditionally only possible or performant on the server-side can be shifted to the client. Doing so eliminates the needs that comes with building and maintaining server-side infrastructure.

## North star
- Simple to use / "batteries included"
    - Everything works out of the box with reasonable defaults (e.g. no custom web server configuration required)
- Maintain a fast and fluid user experience
- Little-to-no repetition to minimize maintence burden from content changes (e.g. titles are pulled from markdown files, not declared in config).

## Current limititations
- Page slugs are hashes, this allows for easy setup without worrying about configuring redirects on the web server
