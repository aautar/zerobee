import { PaperPlane } from 'paper-plane';
import { MarkdownConversionWorkerJsString } from './MarkdownConversionWorker/MarkdownConversionWorker.string.mjs';
import { PageScaffolder } from './UserInterface/PageScaffolder.mjs';
import { ZBError } from './ZBError.mjs';
import { QueryExtractor } from './URL/QueryExtractor.mjs';
import { DOMOps } from './UserInterface/DOMOps.mjs';

/**
 * 
 * @param {Window} _window 
 */
const ZeroBee = function(_window) {
    const self = this;

    /**
     * @var {Date}
     */
    let initialLoadStartTime = new Date();

    /**
     * @var {Boolean}
     */
    let isPerformingInitialLoad = true;

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

    /**
     * @var {ZBLoadingPanel}
     */
    let loadingPanel = null;

    /**
     * @var {String}
     */
    let internalLinkFormat = "hash";

    /**
     * @var {String}
     */
    let siteTitle = "";

    /**
     * 
     * @returns {String}
     */
    const getWindowLocationHashWithoutQuery = function() {
        const parts = window.location.hash.split('?');
        return parts[0];
    };

    /**
     * 
     * @returns {String}
     */
    const getWindowLocationQuery = function() {
        const parts = window.location.hash.split('?');
        return parts[1];
    };

    /**
     * 
     * @param {String} _slug 
     */
    const loadPage = function(_slug, _onError) {
        const slugParts = _slug.split('?');
        const slugHashPart = slugParts[0];
        const queryPart = slugParts[1];

        const pageContent = slugToPageContent.get(slugHashPart) || null;

        // @todo wait until pageContent not null 

        if(pageContent !== null) {
            if(typeof pageContent.error === 'undefined' || pageContent.error === null) {
                docDisplayPanel.render(pageContent.html, slugHashPart);
                docOutlinePanel.render(pageContent.outline, slugHashPart);
                menu.activateMenuItem(slugHashPart);

                if(pageContent.title === pageContent.slug) {
                    self.setPageTitle(siteTitle);
                } else {
                    self.setPageTitle(`${siteTitle}: ${pageContent.title}`);
                }

                if(queryPart) {
                    const queryKeyVals = QueryExtractor.extractKeyValuePairs(queryPart);
                    docDisplayPanel.scrollHeadingIntoView(queryKeyVals['h']);
                }
            } else {
                throw new ZBError("page-content-not-found", pageContent.error.message);
            }
        } else {
            throw new ZBError("page-not-found", `No content for ${_slug} was loaded (check that entry exists in zb.json)`);
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
                    "error": _msg.data.error,
                }                
            );
            
            if(_msg.data.error === null) {
                // Only update titles if no error was encountered when loading content
                slugToTitleMap.set(_msg.data.slug, _msg.data.title);
                if(_msg.data.title !== _msg.data.slug) {
                    menu.updateMenuItemTitle(_msg.data.title, _msg.data.slug);
                }
            } else {
                /**
                 * @todo surface loading error to user? in console?
                 */
            }
           
            // handle loading initial page
            if((`#${_msg.data.slug}` === getWindowLocationHashWithoutQuery()) || (_msg.data.slug === "" && getWindowLocationHashWithoutQuery() === "")) {
                const queryPart = getWindowLocationQuery();
                let fullSlug = _msg.data.slug;
                if(queryPart) {
                    fullSlug += `?${queryPart}`;
                }

                try {
                    loadPage(fullSlug);
                    if(isPerformingInitialLoad) {
                        isPerformingInitialLoad = false;
                        loadingPanel.hide(initialLoadStartTime);
                    }
                } catch(_err) {
                    if(_err.constructor.name === ZBError.name) {
                        criticalErrorPanel.addErrorMessage(_err.getMessage());
                    }
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

        createDocPage("", "index.md", ""); // special case for index.md
        loadDocSection(_docs, "");
    };

    /**
     * 
     * @param {Object} _zbObj 
     */
    const loadConfig = function(_zbObj) {
        siteTitle = _zbObj.siteTitle || "ZeroBee Site";
        self.setPageTitle(siteTitle);

        if(_zbObj.favicon) {
            self.setFavIcon(_zbObj.favicon);
        }

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
                    criticalErrorPanel.addErrorMessage(`Failed to find stylesheet for ${_theme} theme`);
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

    /**
     * 
     * @param {String} _faviconURL 
     */
    this.setFavIcon = function(_faviconURL) {
        DOMOps.appendHTML(_window.document.head, `<link rel="icon" href="${_faviconURL}">`);
    };

    this.load = function() {
        isPerformingInitialLoad = true;
        initialLoadStartTime = new Date();
        loadingPanel.show();

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
                    criticalErrorPanel.addErrorMessage("zb.json configuration file not found");
                }
            }
        );

        _window.addEventListener("hashchange", (_e) => {
            criticalErrorPanel.clear();
            
            try {
                loadPage(window.location.hash.substring(1));
            } catch(_err) {
                if(_err.constructor.name === ZBError.name) {
                    const oldURL = new URL(_e.oldURL);
                    history.replaceState(undefined, undefined, oldURL.hash);

                    // Ideally we should be able to prevent/rollback URL hash change if exception occurs
                    criticalErrorPanel.addErrorMessage(_err.getMessage());
                }
            }
        });
    };

    const pageComponents = PageScaffolder.setupPage(_window.document);
    docDisplayPanel = pageComponents.docDisplayPanel;
    menu = pageComponents.menu;
    criticalErrorPanel = pageComponents.criticalErrorPanel;
    docOutlinePanel = pageComponents.docOutlinePanel;
    loadingPanel = pageComponents.loadingPanel;
};

export { ZeroBee }
