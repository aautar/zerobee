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

    let curMenuDOMEl = null;

    /**
     * 
     * @param {String} _slug 
     */
    const loadPage = function(_slug) {
        const pageHtml = docHtmlMap.get(_slug) || null;

        // @todo wait until pageHtml not null 

        if(pageHtml !== null) {
            const pageDOMEl = _window.document.getElementsByClassName("zb-current-page")[0];
            pageDOMEl.innerHTML = pageHtml;
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

        DOMOps.appendHTML(curMenuDOMEl, `<li><a class="zb-menu-link" href="#${_slug}">${_title}</a></li>`);

        mkConversionWorker.postMessage(
            {
                "rootURL": rootURL + "docs/",
                "path": _path,
                "slug": _slug,
            }
        );

        mkConversionWorker.onmessage = function(_msg) {
            docHtmlMap.set(_msg.data.slug, _msg.data.html);
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
    const loadDocSection = function(_subDocs, _parentSlug, _leafChildSlug) {
        if(_leafChildSlug) {
            const menuDOMEl = _window.document.getElementsByClassName("zb-menu")[0];
            const liDOMEl = DOMOps.appendHTML(menuDOMEl, `<li><a class="zb-menu-section-link" href="#">${_leafChildSlug}</a><ul class="zb-submenu zb-hide"></ul></li>`);
            const achorDOMEl = liDOMEl.getElementsByClassName("zb-menu-section-link")[0];
            const subMenuULEl = liDOMEl.getElementsByClassName("zb-submenu")[0];

            achorDOMEl.addEventListener("click", function(_e) {
                _e.preventDefault();
                if(subMenuULEl.classList.contains("zb-hide")) {
                    subMenuULEl.classList.remove("zb-hide");
                } else {
                    subMenuULEl.classList.add("zb-hide");
                }
            });

            curMenuDOMEl = subMenuULEl;
        }

        for(const slug in _subDocs) {
            let pageSlug = slug;
            if(_parentSlug !== "") {
                pageSlug = `${_parentSlug}/${slug}`
            }

            if(_subDocs[slug].path) {
                createDocPage(pageSlug, _subDocs[slug].path, `¶${slug}`);
            } else {
                loadDocSection(_subDocs[slug], pageSlug, slug);
            }
        }
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
        PaperPlane.get("zb.json", new Map(), (_resp) => {
            loadConfig(_resp);
        });

        console.log(`current hash = ${window.location.hash}`);
        _window.addEventListener("hashchange", (_e) => {
            loadPage(window.location.hash.substring(1));
        });
    };

    const pageCoreDOMElements = PageScaffolder.setupPage(_window.document);
    curMenuDOMEl = pageCoreDOMElements.menuElement;
};

export { ZeroBee }
