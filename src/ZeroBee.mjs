import { PaperPlane } from 'paper-plane';
import { MarkdownConversionWorkerJsString } from './MarkdownConversionWorker/MarkdownConversionWorker.string.mjs';
import { PageScaffolder } from './PageScaffolder.mjs';

/**
 * 
 * @param {Window} _window 
 */
const ZeroBee = function(_window) {
    const self = this;

    /**
     * @var {String}
     */
    const rootURL = _window.location.origin + _window.location.pathname;

    /**
     * @var {URL}
     */
    const mkConversionWorkerURL = URL.createObjectURL(new Blob([ MarkdownConversionWorkerJsString ], { type: 'application/javascript' }));

    /**
     * @var {Worker}
     */
    const mkConversionWorker = new Worker(mkConversionWorkerURL, {"type": "module"});

    /**
     * @var {Map<String, Object>}
     */
    const slugToPageContent = new Map();

    /**
     * @var {Map<String, String>}
     */
    const slugToTitleMap = new Map();

    /**
     * @var {ZBMenu|null}
     */
    let menu = null;

    /**
     * @var {ZBMenuSection|null}
     */
    let curMenuSection = null;

    /**
     * @var {ZBDocDisplayPanel|null}
     */
    let docDisplayPanel = null;

    /**
     * @var {ZBDocOutlinePanel|null}
     */
    let docOutlinePanel = null;

    /**
     * @var {ZBCriticalErrorPanel}
     */
    let criticalErrorPanel = null;

    const internalLinkFormat = "hash";

    /**
     * 
     * @returns {String}
     */
    const getWindowLocationHashWithoutQuery = function() {
        const parts = window.location.hash.split('?');
        return parts[0];
    }

    /**
     * 
     * @returns {String}
     */
    const getWindowLocationQuery = function() {
        const parts = window.location.hash.split('?');
        return parts[1];
    }

    /**
     * 
     * @param {String} _slug 
     */
    const loadPage = function(_slug) {
        const slugParts = _slug.split('?');
        const slugHashPart = slugParts[0];
        const queryPart = slugParts[1];

        const pageContent = slugToPageContent.get(slugHashPart) || null;

        // @todo wait until pageContent not null 

        if(pageContent !== null) {
            docDisplayPanel.render(pageContent.html);
            docOutlinePanel.render(pageContent.outline, slugHashPart);
            menu.activateMenuItem(slugHashPart);

            if(queryPart) {
                const queryParts = queryPart.split('&');
                queryParts.forEach((_qp) => {
                    const queryKeyVal = _qp.split('=');
                    if(queryKeyVal[0] === 'h') {
                        docDisplayPanel.scrollHeadingIntoView(queryKeyVal[1]);
                    }
                });
            }
        }
    };

    /**
     * 
     * @param {String} _slug 
     * @param {String} _path 
     * @param {String} _title 
     */
    const createDocPage = function(_slug, _path, _title) {
        slugToPageContent.set(_slug, null);

        if(curMenuSection) {
            curMenuSection.addMenuItem(_title, _slug);
        } else {
            menu.addMenuItem(_title, _slug);
        }

        mkConversionWorker.postMessage(
            {
                "rootURL": rootURL + "docs/",
                "path": _path,
                "slug": _slug,
                "internalLinkFormat": internalLinkFormat,
            }
        );

        mkConversionWorker.onmessage = function(_msg) {
            slugToPageContent.set(
                _msg.data.slug, 
                {
                    "title": _msg.data.title,
                    "html": _msg.data.html,
                    "outline": _msg.data.outline,
                }                
            );

            slugToTitleMap.set(_msg.data.slug, _msg.data.title);

            if(_msg.data.title !== _msg.data.slug) {
                menu.updateMenuItemTitle(_msg.data.title, _msg.data.slug);
            }

            if(`#${_msg.data.slug}` === getWindowLocationHashWithoutQuery()) { // handle loading initial page
                const queryPart = getWindowLocationQuery();
                if(queryPart) {
                    loadPage(_msg.data.slug + `?${queryPart}`);
                } else {
                    loadPage(_msg.data.slug);
                }
            }
        };
    };

    /**
     * 
     * @param {Object} _subDocs 
     * @param {String} _parentSlug 
     * @param {String} _leafChildSlug
     */
    const loadDocSection = function(_subDocs, _parentSlug, _leafChildSlug, _title) {
        if(_leafChildSlug) {
            if(curMenuSection) {
                curMenuSection = curMenuSection.addMenuSection(_title);
            } else {
                curMenuSection = menu.addMenuSection(_title);
            }
        }

        for(const slug in _subDocs) {
            let pageSlug = slug;
            if(_parentSlug !== "") {
                pageSlug = `${_parentSlug}/${slug}`
            }

            if(_subDocs[slug].path) {
                createDocPage(pageSlug, _subDocs[slug].path, `${slug}`);
            } else {
                if(typeof _subDocs[slug] === 'object') {
                    loadDocSection(
                        _subDocs[slug], 
                        pageSlug, 
                        slug, 
                        (_subDocs[slug].title ? _subDocs[slug].title : slug)
                    );
                }
            }
        }

        // reset
        curMenuSection = null;
    };

    /**
     * 
     * @param {Object} _docs
     */
    const loadDocs = function(_docs) {
        // @todo verify slugs are unique

        loadDocSection(_docs, "");
    };

    /**
     * 
     * @param {Object} _zbObj 
     */
    const loadConfig = function(_zbObj) {
        self.setPageTitle(_zbObj.pageTitle);
        loadDocs(_zbObj.docs);

        if(_zbObj.internalLinkFormat) {
            internalLinkFormat = _zbObj.internalLinkFormat;
        }
    };

    /**
     * 
     * @param {String} _theme 
     */
    const loadTheme = function(_theme) {
        PaperPlane.get(
            `themes/${_theme}/styles.css`, 
            new Map(), 
            (_resp) => {
                window.document.head.insertAdjacentHTML("beforeend", `<style>${_resp}</style>`)
            },
            (_err, _xhr) => {
                if(_xhr.status === 404) {
                    criticalErrorPanel.show(`Failed to find stylesheet for ${_theme} theme`);
                }
            }
        );
    };

    /**
     * 
     * @param {String} _title 
     */
    this.setPageTitle = function(_title) {
        _window.document.title = _title;
    };

    this.load = function() {
        PaperPlane.get(
            "zb.json", 
            new Map(), 
            (_resp) => {
                loadConfig(_resp);
                if(_resp.theme) {
                    loadTheme(_resp.theme);
                }
            },
            (_err, _xhr) => {
                if(_xhr.status === 404) {
                    criticalErrorPanel.show("zb.json configuration file not found");
                }
            }
        );

        _window.addEventListener("hashchange", (_e) => {
            loadPage(window.location.hash.substring(1));
        });
    };

    const pageComponents = PageScaffolder.setupPage(_window.document);
    docDisplayPanel = pageComponents.docDisplayPanel;
    menu = pageComponents.menu;
    criticalErrorPanel = pageComponents.criticalErrorPanel;
    docOutlinePanel = pageComponents.docOutlinePanel;
};

export { ZeroBee }
