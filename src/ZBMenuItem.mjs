import { DOMOps } from "./DOMOps.mjs";

const ZBMenuItem = function(_title, _slug, _parentDOMElement) {
    const liDOMEl = DOMOps.appendHTML(_parentDOMElement, `<li><a class="zb-menu-link" href="#${_slug}">${_title}</a></li>`, true);

    /**
     * 
     * @returns {String}
     */
    this.getTitle = function() {
        return _title;
    };

    /**
     * 
     * @param {String} _newTitle 
     */
    this.setTitle = function(_newTitle) {
        _title = _newTitle;
        liDOMEl.getElementsByClassName("zb-menu-link")[0].innerHTML = _newTitle;
    };

    /**
     * 
     * @returns {String}
     */
    this.getSlug = function() {
        return _slug;
    };
};

export { ZBMenuItem }
