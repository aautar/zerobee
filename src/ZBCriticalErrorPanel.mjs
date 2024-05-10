import { DOMOps } from "./DOMOps.mjs";

const ZBCriticalErrorPanel = function(_parentDOMElement) {
    const docPanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<div class="zb-hide zb-critical-error"></div>`, true);

    this.show = function(_errorMsg) {
        docPanelDOMEl.innerHTML = _errorMsg;
        docPanelDOMEl.classList.remove("zb-hide");
    };
};

export { ZBCriticalErrorPanel }
