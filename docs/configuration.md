# Configuration

Site settings are configured using a JSON configuration file named `zb.json`

## Site information

### Title

```json
{
    ...
    "siteTitle": "<SITE-TITLE>" 
    ...
}
```

Base/prefix title for the site. The title when a specific document is loaded will be `<SITE-TITLE>: <DOCUMENT-TITLE>`.

If no title is specified (i.e. `siteTitle` isn't defined in `zb.json`), a default value of "ZeroBee Site" is used.

### Favicon

```json
{
    ...
    "favicon": "<FAVICON-URL>"
    ...
}
```

URL to a [favicon](https://en.wikipedia.org/wiki/Favicon) to use for the site.

### Custom theme

```json
{
    ...
    "theme": "<CUSTOM-THEME-NAME>"
    ...
}
```

Name of custom theme to use for the site. A custom theme is simply a CSS stylesheet that adds to or overrides the core styles that are defined. This stylesheet should be located at `themes/<CUSTOM-THEME-NAME>/styles.css`, which the `themes` folder being within the same directory as `zb.json`.


### Internal link format

```json
{
    ...
    "internalLinkFormat": "<LINK-FORMAT>"
    ...
}
```

Defines how internal links are constructed.
Currently, the only valid value is `hash`, as linking and navigating within the site is done by referencing and updating the [hash property](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) of the current window's location interface.

### Document Tree

All documents and sections for the site and defined within the `docs` object.

#### Individual document

```json
{
    ...
    "docs": {
        "<DOC-SLUG>": {
            "path": "<MARKDOWN-FILE-PATH>"
        },
    }
    ...
}
```

`DOC-SLUG` is the identifier used to reference the document; it will be used in links and displayed in the browser's URL (based on the value of `internalLinkFormat`).

`MARKDOWN-FILE-PATH` is the path to the Markdown file. This path is relative to the document root, i.e. the `docs` folder.


#### Section

```json
{
    ...
    "<SECTION-SLUG>": {
        "title": "<SECTION-TITLE>",

        "<DOC-SLUG>": {
            "path": "<MARKDOWN-FILE-PATH>"
        },

        ...
    },
    ...
}
```

`SECTION-SLUG` is the identifier used to reference the section; it will be used in links and displayed in the browser's URL (based on the value of `internalLinkFormat`).

`SECTION-TITLE` is the title for the section, displayed in the navigation tree for the site.

`DOC-SLUG` and `MARKDOWN-FILE-PATH` define an individual document within the section (see `Individual document` section above). Multiple documents can be defined in this manner.

Sections may also themselves contain sections, using the same syntax, allowing users to build out a document hiearchy.
