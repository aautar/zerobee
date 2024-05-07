import { PaperPlane } from 'paper-plane';
import { DOMOps } from './DOMOps.mjs';
import { MarkdownConversionWorkerJsString } from './MarkdownConversionWorker/MarkdownConversionWorker.string.mjs';

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

    const createHtmlScaffolding = function() {
        DOMOps.appendHTML(_window.document.body, `<menu class="zb-menu"></menu>`);
        DOMOps.appendHTML(_window.document.body, `<div class="zb-current-page"></div>`);
    };

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

        const menuDOMEl = _window.document.getElementsByClassName("zb-menu")[0];
        DOMOps.appendHTML(menuDOMEl, `<li><a class="zb-menu-link" href="#${_slug}">${_title}</a></li>`);

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
     */
    const loadDocSection = function(_subDocs, _parentSlug) {
        for(const slug in _subDocs) {
            let pageSlug = slug;
            if(_parentSlug !== "") {
                pageSlug = `${_parentSlug}/${slug}`
            }

            if(_subDocs[slug].path) {
                createDocPage(pageSlug, _subDocs[slug].path, `¶${slug}`);
            } else {
                loadDocSection(_subDocs[slug], pageSlug);
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

    createHtmlScaffolding();
};

export { ZeroBee }
