import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuItem } from "./ZBMenuItem.mjs";
import { ZBMenuSection } from "./ZBMenuSection.mjs";

const ZBMenu = function(_parentDOMElement) {
    const menuDOMElement = DOMOps.appendHTML(_parentDOMElement, `<menu class="zb-menu"></menu>`);
    const menuItems = [];

    /**
     * 
     * @param {String} _newTitle 
     * @param {String} _slug 
     */
    this.updateMenuItemTitle = function(_newTitle, _slug) {
        for(let i=0; i<menuItems.length; i++) {
            if(menuItems[i].constructor.name === ZBMenuItem.name && menuItems[i].getSlug() === _slug) {
                menuItems[i].setTitle(_newTitle);
                return true;
            }

            if(menuItems[i].constructor.name === ZBMenuSection.name) {
                const foundItem = menuItems[i].updateMenuItemTitle(_newTitle, _slug);
                if(foundItem) {
                    return true;
                }
            }
        }

        return false;
    };

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
