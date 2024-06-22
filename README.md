# ZeroBee

A "zero build" documentation platform

ZeroBee is an experiment to create an [MkDocs](https://www.mkdocs.org/)-like system where file processing and site creation happens entirely within the browser. ZeroBee will take markdown documents and create a static, singe-page, site instantly, without any prerequistie build process.

## How to use

### Basic setup
On your web server, from a directory where traffic is served:
- Copy the "scaffolder page" (`dist/index.html`) into the directory
- Create a sub-directory names `docs` for your markdown documents
- Create a config (`zb.json`) for the site

See [the configuration spec](docs/configuration.md) for details on how to setup the site and documents.

Also, the configuration for the sample site ([example/zb.json](example/zb.json)) may be useful.

## Why?
As web clients continue to get more powerful, compute that was traditionally only possible or performant on the server-side can be shifted to the client. Doing so eliminates the needs that comes with building and maintaining server-side infrastructure.

## North star
- Simple to use / "batteries included"
    - Everything works out of the box with reasonable defaults (e.g. no custom web server configuration required)
- Maintain a fast and fluid user experience
- Little-to-no repetition to minimize maintence burden from content changes (e.g. titles are pulled from markdown files, not declared in config).

## Under the hood
- Conversion from Markdown to HTML is done via [markdown-it](https://github.com/markdown-it/markdown-it), with conversion being done in the background with a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- UI components and DOM manipulation is done with [plain old Javascript](https://www.crockford.com/domjs.html)

## Build

The build process consists of using [rollup.js](https://rollupjs.org/) no create the necessary distribution files, including the `dist/index.html` file intended for use by most consumers.

```bash
npm run build
```

The build process will also update the `example/index.html` file.

You can run a local webserver to see these changes, e.g.:

```bash
npx http-server .
```

## Current limititations
- Page slugs are hashes, this allows for easy setup without worrying about configuring redirects on the web server
