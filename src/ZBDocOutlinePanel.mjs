import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuSection } from "./ZBMenuSection.mjs";

const ZBDocOutlinePanel = function(_parentDOMElement) {
    const docOutlinePanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<menu class="zb-current-doc-outline"></menu>`, true);

    const primarySection = new ZBMenuSection(null, docOutlinePanelDOMEl);
    primarySection.expandSection();

    /**
     * 
     * @param {Object[]} _outline 
     */
    this.render = function(_outline) {
        for(let i=0; i<_outline.length; i++) {
            primarySection.addMenuItem(_outline[i].title, "xyz");
        }

        //docOutlinePanelDOMEl.innerHTML = OutlineListBuilder.buildHTMLFromOutlineArray(_outline);
    };
};

export { ZBDocOutlinePanel }
