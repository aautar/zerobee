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

    /**
     * 
     * @param {Object[]} _docsArr 
     */
    const loadDocs = function(_docsArr) {
        const menuDOMEl = _window.document.getElementsByClassName("zb-menu")[0];

        // verify slugs are unique

        for(let i=0; i<_docsArr.length; i++) {
            docHtmlMap.set(_docsArr[i].slug, null);
            DOMOps.appendHTML(menuDOMEl, `<li><a class="zb-menu-link" href="#${_docsArr[i].slug}">${_docsArr[i].title}</a></li>`);

            mkConversionWorker.postMessage(
                {
                    "rootURL": rootURL + "docs/",
                    "path": _docsArr[i].path,
                    "slug": _docsArr[i].slug,
                }
            );

            mkConversionWorker.onmessage = function(_msg) {
                docHtmlMap.set(_msg.data.slug, _msg.data.html);
                console.log(_msg.data.html);
            };
        }
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
        DOMOps.appendHTML(_window.document.body, `<menu class="zb-menu"></menu>`);

        PaperPlane.get("zb.json", new Map(), (_resp) => {
            loadConfig(_resp);
        });

        console.log(`current hash = ${window.location.hash}`);
        _window.addEventListener("hashchange", (_e) => {
            console.log(_e);
        });
    }
};

export { ZeroBee }
