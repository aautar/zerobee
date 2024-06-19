import { DOMOps } from "./DOMOps.mjs";

const ZBMenuItem = function(_title, _slug, _parentDOMElement) {
    const liDOMEl = DOMOps.appendHTML(_parentDOMElement, `<li class="zb-menu-item"><a class="zb-menu-link" href="#${_slug}">${_title}</a></li>`, true);

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

    this.activate = function() {
        liDOMEl.getElementsByClassName("zb-menu-link")[0].classList.add('zb-active');
    };

    this.deactivate = function() {
        liDOMEl.getElementsByClassName("zb-menu-link")[0].classList.remove('zb-active');
    };
};

export { ZBMenuItem }
