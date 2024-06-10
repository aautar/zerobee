import { DOMOps } from './DOMOps.mjs';
import { ZBCriticalErrorPanel } from './ZBCriticalErrorPanel.mjs';
import { ZBDocDisplayPanel } from './ZBDocDisplayPanel.mjs';
import { ZBDocOutlinePanel } from './ZBDocOutlinePanel.mjs';
import { ZBLoadingPanel } from './ZBLoadingPanel.mjs';
import { ZBMenu } from './ZBMenu.mjs';

const PageScaffolder = {
    /**
     * 
     * @param {Document} _document 
     */
    _setupCoreStyles: function(_document) {
        const cssStyles = `
            * { padding:0; margin:0; text-decoration:none; }
            body { background: #262626; }
            ul, li { list-style: none; }
            .zb-hide { display: none }
        `;

        _document.head.insertAdjacentHTML("beforeend", `<style>${cssStyles}</style>`)
    },

    /**
     * 
     * @param {Document} _document 
     */
    setupPage: function(_document) {
        this._setupCoreStyles(_document);

        const bodyElem = _document.body;

        const wrapperElement = DOMOps.appendHTML(bodyElem, `<div class="zb-page-wrapper"></div>`);

        const menu = new ZBMenu(wrapperElement);
        const docDisplayPanel = new ZBDocDisplayPanel(wrapperElement);
        const criticalErrorPanel = new ZBCriticalErrorPanel(document.body);
        const docOutlinePanel = new ZBDocOutlinePanel(wrapperElement);
        const loadingPanel = new ZBLoadingPanel(document.body);

        return {
            "menu": menu,
            "docDisplayPanel": docDisplayPanel,
            "criticalErrorPanel": criticalErrorPanel,
            "docOutlinePanel": docOutlinePanel,
            "loadingPanel": loadingPanel,
        };
    }
};

export { PageScaffolder }
