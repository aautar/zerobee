import { DOMOps } from "./DOMOps.mjs";

const ZBDocDisplayPanel = function(_parentDOMElement) {
    const docPanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<div class="zb-current-doc"></div>`, true);

    this.render = function(_docHtml) {
        docPanelDOMEl.innerHTML = _docHtml;
    };
};

export { ZBDocDisplayPanel }
