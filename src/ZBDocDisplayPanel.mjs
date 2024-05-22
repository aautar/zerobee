import { DOMOps } from "./DOMOps.mjs";
import { HeadingSlugGenerator } from "./HeadingSlugGenerator.mjs";

const ZBDocDisplayPanel = function(_parentDOMElement) {
    const docPanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<div class="zb-current-doc"></div>`, true);

    this.scrollHeadingIntoView = function(_headingSlug) {
        const headerDOMElements = docPanelDOMEl.querySelectorAll("h1, h2, h3, h4, h5, h6");
        for(let i=0; i<headerDOMElements.length; i++) {
            if(HeadingSlugGenerator.generate(headerDOMElements[i].innerText) === _headingSlug) {
                headerDOMElements[i].scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
                break;
            }
        }        
    };

    this.render = function(_docHtml) {
        docPanelDOMEl.innerHTML = _docHtml;
    };
};

export { ZBDocDisplayPanel }
