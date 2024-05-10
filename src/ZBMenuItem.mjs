import { DOMOps } from "./DOMOps.mjs";

const ZBMenuItem = function(_title, _slug, _parentDOMElement) {
    DOMOps.appendHTML(_parentDOMElement, `<li><a class="zb-menu-link" href="#${_slug}">${_title}</a></li>`, true);
};

export { ZBMenuItem }
