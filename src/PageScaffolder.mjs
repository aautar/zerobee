import { DOMOps } from './DOMOps.mjs';

const PageScaffolder = {
    /**
     * 
     * @param {Document} _document 
     */
    _setupCoreStyles: function(_document) {
        const cssStyles = `
            .zb-hide { display: none }
        `;

        _document.head.insertAdjacentHTML("beforeend", `<style>${cssStyles}</style>`)
    },

    /**
     * 
     * @param {Document} _document 
     */
    setupPage: function(_document) {
        const bodyElem = _document.body;
        this._setupCoreStyles(_document);
        const menuElement = DOMOps.appendHTML(bodyElem, `<menu class="zb-menu"></menu>`);
        const pageElement = DOMOps.appendHTML(bodyElem, `<div class="zb-current-page"></div>`);
        const criticalErrorElement = DOMOps.appendHTML(bodyElem, `<div class="zb-hide zb-critical-error"></div>`);

        return {
            "menuElement": menuElement,
            "pageElement": pageElement,
            "criticalErrorElement": criticalErrorElement,
        };
    }
};

export { PageScaffolder }
