import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuItem } from "./ZBMenuItem.mjs";
import { ZBMenuSection } from "./ZBMenuSection.mjs";

const ZBMenu = function(_parentDOMElement) {
    const menuDOMElement = DOMOps.appendHTML(_parentDOMElement, `<menu class="zb-menu"></menu>`);

    const primarySection = new ZBMenuSection(null, menuDOMElement);
    primarySection.expandSection();

    /**
     * 
     * @param {String} _newTitle 
     * @param {String} _slug 
     */
    this.updateMenuItemTitle = function(_newTitle, _slug) {
        return primarySection.updateMenuItemTitle(_newTitle, _slug);
    };

    /**
     * 
     * @param {String} _slug 
     * @returns {Boolean}
     */
    this.activateMenuItem = function(_slug) {
        return primarySection.activateMenuItem(_slug);
    };

    /**
     * 
     * @param {String} _slug 
     * @returns {Boolean}
     */
    this.deactivateMenuItem = function(_slug) {
        return primarySection.deactivateMenuItem(_slug);
    };

    /**
     * 
     * @param {String} _title 
     * @param {String} _slug 
     */
    this.addMenuItem = function(_title, _slug) {
        return primarySection.addMenuItem(_title, _slug);
    };

    /**
     * 
     * @param {String} _title 
     * @returns {ZBMenuSection}
     */
    this.addMenuSection = function(_title) {
        return primarySection.addMenuSection(_title);
    };
};

export { ZBMenu }
