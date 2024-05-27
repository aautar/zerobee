# What is ZeroBee?

ZeroBee is a "zero build" documentation platform

ZeroBee will take markdown documents and create a static, singe-page, site instantly, without any prerequistie build process.

## Why?
- Browers are increadibly powerful
- Without the componments of a build process there's a whole lot less to maintain

## Under the hood
```
{
    "pageTitle": "ZeeBee Hello",
    "favicon": null,
    "theme": "core",
    "internalLinkFormat": "hash",
    "docs": {
        "home": {
            "path": "home.md"
        },
        "demo": {
            "title": "Demos",
            "markdown-it-demo": {
                "path": "demo/markdown-it-demo-page.md"
            }
        },
        "about": {
            "title": "About",
            "x1": {
                "path": "about/x1.md"
            }
        },
        "sub1": {
            "title": "sub1",
            "sub2": {
                "title": "sub2",
                "test": {
                    "path": "sub1/sub2/test.md"
                }
            }
        }
    }
}
```

## Test pages
- [markdown-demo-page](demo/markdown-it-demo)
