import { DOMOps } from './DOMOps.mjs';
import { ZBDocDisplayPanel } from './ZBDocDisplayPanel.mjs';
import { ZBMenu } from './ZBMenu.mjs';

const PageScaffolder = {
    /**
     * 
     * @param {Document} _document 
     */
    _setupCoreStyles: function(_document) {
        const cssStyles = `
            * { padding:0; margin:0; text-decoration:none; }
            ul, li { list-style: none; }
            .zb-hide { display: none }
            .zb-page-wrapper { 
                display: grid;
                grid-template-columns: 350px 1fr;
                gap: 16px;
            }
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

        const criticalErrorElement = DOMOps.appendHTML(wrapperElement, `<div class="zb-hide zb-critical-error"></div>`);

        return {
            "menu": menu,
            "docDisplayPanel": docDisplayPanel,
            "wrapperElement": wrapperElement,
            "criticalErrorElement": criticalErrorElement,
        };
    }
};

export { PageScaffolder }
