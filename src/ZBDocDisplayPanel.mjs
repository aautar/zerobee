import { DOMOps } from "./DOMOps.mjs";
import { HeadingSlugGenerator } from "./HeadingSlugGenerator.mjs";

/**
 * 
 * @param {Element} _parentDOMElement 
 */
const ZBDocDisplayPanel = function(_parentDOMElement) {
    const docPanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<div class="zb-current-doc"></div>`, true);
    const slugPartialToHeading = new Map();

    /**
     * 
     * @param {String} _headingSlug URI-encoded partial heading slug
     */
    this.scrollHeadingIntoView = function(_headingSlug) {
        const domEl = slugPartialToHeading.get(_headingSlug);
        if(domEl) {
            domEl.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    };

    /**
     * 
     * @param {String} _docHtml 
     * @param {String} _baseSlug 
     */
    this.render = function(_docHtml, _baseSlug) {
        docPanelDOMEl.innerHTML = _docHtml;

        const headerDOMElements = docPanelDOMEl.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headerDOMElements.forEach((_domElem) => {
            slugPartialToHeading.set(HeadingSlugGenerator.generate(_domElem.innerText), _domElem); // capture before making any mutations to the element
        });

        headerDOMElements.forEach((_domElem) => {
            const headingSlugPart = HeadingSlugGenerator.generate(_domElem.innerText);
            DOMOps.appendHTML(_domElem, `<a class="permalink" href="#${_baseSlug}?h=${headingSlugPart}">¶</a>`);
        });
    };
};

export { ZBDocDisplayPanel }
