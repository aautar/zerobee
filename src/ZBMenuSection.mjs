import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuItem } from "./ZBMenuItem.mjs";

const ZBMenuSection = function(_title, _parentDOMElement) {
    const menuItems = [];

    let sectionListItemDOMEl = null;

    if(_title === null) {
        sectionListItemDOMEl = DOMOps.appendHTML(_parentDOMElement, `<li class="zb-menu-item"><a class="zb-menu-section-link zb-hide" href="#"></a><ul class="zb-submenu zb-hide"></ul></li>`, true);
    } else {
        sectionListItemDOMEl = DOMOps.appendHTML(_parentDOMElement, `<li class="zb-menu-item"><a class="zb-menu-section-link" href="#">${_title}</a><ul class="zb-submenu zb-hide"></ul></li>`, true);
    }

    const achorDOMEl = sectionListItemDOMEl.getElementsByClassName("zb-menu-section-link")[0];
    const subMenuULEl = sectionListItemDOMEl.getElementsByClassName("zb-submenu")[0];

    this.expandSection = function() {
        subMenuULEl.classList.remove("zb-hide");
    };

    this.collapseSection = function() {
        for(let i=0; i<menuItems.length; i++) {
            if(menuItems[i].constructor.name === ZBMenuSection.name) {
                menuItems[i].collapseSection();
            }
        }
        
        subMenuULEl.classList.add("zb-hide");
    };

    /**
     * 
     * @param {String} _title 
     * @param {String} _slug 
     */
    this.addMenuItem = function(_title, _slug) {
        menuItems.push(
            new ZBMenuItem(_title, _slug, subMenuULEl)
        )
    };

    /**
     * 
     * @param {String} _title 
     * @returns {ZBMenuSection}
     */
    this.addMenuSection = function(_title) {
        const sec = new ZBMenuSection(_title, subMenuULEl);
        menuItems.push(sec);
        return sec;
    };
    
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
     * @param {String} _slug 
     */
    this.activateMenuItem = function(_slug) {
        let foundItem = false;
        for(let i=0; i<menuItems.length; i++) {
            if(menuItems[i].constructor.name === ZBMenuItem.name) {
                if(menuItems[i].getSlug() === _slug) {
                    menuItems[i].activate();
                    foundItem = true;
                } else {
                    menuItems[i].deactivate();
                }
            }

            if(menuItems[i].constructor.name === ZBMenuSection.name) {
                if(!foundItem) {
                    if(menuItems[i].activateMenuItem(_slug)) {
                        foundItem = true;
                        menuItems[i].expandSection();
                    } else {
                        menuItems[i].deactivateAllMenuItems();
                        menuItems[i].collapseSection();
                    }
                } else {
                    menuItems[i].deactivateAllMenuItems();
                    menuItems[i].collapseSection();
                }
            }
        }

        return foundItem;
    };

    /**
     * 
     * @param {String} _slug 
     * @returns {Boolean}
     */
    this.deactivateMenuItem = function(_slug) {
        for(let i=0; i<menuItems.length; i++) {
            if(menuItems[i].constructor.name === ZBMenuItem.name && menuItems[i].getSlug() === _slug) {
                menuItems[i].deactivate();
                return true;
            }

            if(menuItems[i].constructor.name === ZBMenuSection.name) {
                const foundItem = menuItems[i].deactivateMenuItem(_slug);
                if(foundItem) {
                    return true;
                }
            }
        }

        return false;
    };

    this.deactivateAllMenuItems = function() {
        for(let i=0; i<menuItems.length; i++) {
            if(menuItems[i].constructor.name === ZBMenuItem.name) {
                menuItems[i].deactivate();
            }

            if(menuItems[i].constructor.name === ZBMenuSection.name) {
                menuItems[i].deactivateAllMenuItems();
            }
        }

        return false;
    };

    achorDOMEl.addEventListener("click", function(_e) {
        _e.preventDefault();
        if(subMenuULEl.classList.contains("zb-hide")) {
            subMenuULEl.classList.remove("zb-hide");
            subMenuULEl.classList.add("zb-active");
        } else {
            subMenuULEl.classList.add("zb-hide");
            subMenuULEl.classList.remove("zb-active");
        }
    });
};

export { ZBMenuSection }
