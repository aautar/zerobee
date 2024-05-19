import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuSection } from "./ZBMenuSection.mjs";

const ZBDocOutlinePanel = function(_parentDOMElement) {
    const docOutlinePanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<menu class="zb-current-doc-outline"></menu>`, true);

    const primarySection = new ZBMenuSection(null, docOutlinePanelDOMEl);
    primarySection.expandSection();

    const loadOutlineAsMenuItems = function(_outline, _menuSection, _parentSlug) {
        for(let i=0; i<_outline.length; i++) {
            const headingSlug = (_outline[i].title.toLowerCase()).replaceAll(' ', '-');
            _menuSection.addMenuItem(_outline[i].title, `${_parentSlug}?h=${encodeURIComponent(headingSlug)}`);

            if(_outline[i].subTopics.length > 0) {
                const subSec = _menuSection.addMenuSection("");
                loadOutlineAsMenuItems(_outline[i].subTopics, subSec, _parentSlug);
                subSec.expandSection();
            }
        }
    };

    /**
     * 
     * @param {Object[]} _outline 
     * @param {String} _parentSlug
     */
    this.render = function(_outline, _parentSlug) {
        primarySection.clearSubMenuItems();
        loadOutlineAsMenuItems(_outline, primarySection, _parentSlug);
    };
};

export { ZBDocOutlinePanel }
