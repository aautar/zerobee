import { PaperPlane } from 'paper-plane';
import { DOMOps } from './DOMOps.mjs';
import { MarkdownConversionWorkerJsString } from './MarkdownConversionWorker/MarkdownConversionWorker.string.mjs';
import { PageScaffolder } from './PageScaffolder.mjs';

/**
 * 
 * @param {Window} _window 
 */
const ZeroBee = function(_window) {
    const self = this;
    const rootURL = _window.location.origin + _window.location.pathname;

    const mkConversionWorkerURL = URL.createObjectURL(new Blob([ MarkdownConversionWorkerJsString ], { type: 'application/javascript' }));
    const mkConversionWorker = new Worker(mkConversionWorkerURL, {"type": "module"});

    const docHtmlMap = new Map();
    const slugToTitleMap = new Map();

    /**
     * @var {ZBMenu|null}
     */
    let menu = null;

    /**
     * @var {ZBMenuSection|null}
     */
    let curMenuSection = null;

    let docDisplayPanel = null;

    let criticalErrorPanel = null;

    /**
     * 
     * @param {String} _slug 
     */
    const loadPage = function(_slug) {
        const pageHtml = docHtmlMap.get(_slug) || null;

        // @todo wait until pageHtml not null 

        if(pageHtml !== null) {
            docDisplayPanel.render(pageHtml);
        }
    };

    /**
     * 
     * @param {String} _slug 
     * @param {String} _path 
     * @param {String} _title 
     */
    const createDocPage = function(_slug, _path, _title) {
        docHtmlMap.set(_slug, null);

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
            }
        );

        mkConversionWorker.onmessage = function(_msg) {
            docHtmlMap.set(_msg.data.slug, _msg.data.html);
            slugToTitleMap.set(_msg.data.slug, _msg.data.title);

            if(_msg.data.title !== _msg.data.slug) {
                //const menuAnchorEl = _window.document.querySelector(`a[href='#${_msg.data.slug}']`);
                //menuAnchorEl.innerHTML = _msg.data.title;
            }


            if(`#${_msg.data.slug}` === window.location.hash) {
                loadPage(_msg.data.slug);
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
            },
            (_err, _xhr) => {
                if(_xhr.status === 404) {
                    criticalErrorPanel.show("zb.json configuration file not found");
                }
            }
        );

        console.log(`current hash = ${window.location.hash}`);
        _window.addEventListener("hashchange", (_e) => {
            loadPage(window.location.hash.substring(1));
        });
    };

    const pageComponents = PageScaffolder.setupPage(_window.document);
    docDisplayPanel = pageComponents.docDisplayPanel;
    menu = pageComponents.menu;
    criticalErrorPanel = pageComponents.criticalErrorPanel;
};

export { ZeroBee }
