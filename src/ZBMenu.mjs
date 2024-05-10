import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuItem } from "./ZBMenuItem.mjs";
import { ZBMenuSection } from "./ZBMenuSection.mjs";

const ZBMenu = function(_parentDOMElement) {
    const menuDOMElement = DOMOps.appendHTML(_parentDOMElement, `<menu class="zb-menu"></menu>`);
    const menuItems = [];

    /**
     * 
     * @param {String} _title 
     * @param {String} _slug 
     */
    this.addMenuItem = function(_title, _slug) {
        menuItems.push(
            new ZBMenuItem(_title, _slug, menuDOMElement)
        )
    };

    this.addMenuSection = function(_title) {
        const sec = new ZBMenuSection(_title, menuDOMElement);
        menuItems.push(sec);
        return sec;
    };

};

export { ZBMenu }
