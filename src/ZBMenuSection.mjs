import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuItem } from "./ZBMenuItem.mjs";

const ZBMenuSection = function(_title, _parentDOMElement) {
    const menuItems = [];
    const sectionListItemDOMEl = DOMOps.appendHTML(_parentDOMElement, `<li><a class="zb-menu-section-link" href="#">${_title}</a><ul class="zb-submenu zb-hide"></ul></li>`, true);

    const achorDOMEl = sectionListItemDOMEl.getElementsByClassName("zb-menu-section-link")[0];
    const subMenuULEl = sectionListItemDOMEl.getElementsByClassName("zb-submenu")[0];

    achorDOMEl.addEventListener("click", function(_e) {
        _e.preventDefault();
        if(subMenuULEl.classList.contains("zb-hide")) {
            subMenuULEl.classList.remove("zb-hide");
        } else {
            subMenuULEl.classList.add("zb-hide");
        }
    });

    /**
     * 
     * @param {String} _title 
     * @param {String} _slug 
     * @param {ZBMenuSection|undefined} _section 
     */
    this.addMenuItem = function(_title, _slug, _section) {
        menuItems.push(
            new ZBMenuItem(_title, _slug, subMenuULEl)
        )
    };
};

export { ZBMenuSection }
