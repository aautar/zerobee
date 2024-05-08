import { DOMOps } from './DOMOps.mjs';

const PageScaffolder = {
    /**
     * 
     * @param {Document} _document 
     */
    _setupCoreStyles: function(_document) {
        const cssStyles = `
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

        const menuElement = DOMOps.appendHTML(wrapperElement, `<menu class="zb-menu"></menu>`);
        const pageElement = DOMOps.appendHTML(wrapperElement, `<div class="zb-current-page"></div>`);
        const criticalErrorElement = DOMOps.appendHTML(wrapperElement, `<div class="zb-hide zb-critical-error"></div>`);

        return {
            "wrapperElement": wrapperElement,
            "menuElement": menuElement,
            "pageElement": pageElement,
            "criticalErrorElement": criticalErrorElement,
        };
    }
};

export { PageScaffolder }
