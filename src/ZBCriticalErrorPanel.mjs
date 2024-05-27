import { DOMOps } from "./DOMOps.mjs";

const ZBCriticalErrorPanel = function(_parentDOMElement) {
    const docPanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<div class="zb-hide zb-critical-error"></div>`, true);

    const errorMessages = [];

    const buildListFromErrorMessages = function() {
        const items = [];
        for(let i=0; i<errorMessages.length; i++) {
            items.push(`<li>${errorMessages[i]}</li>`);
        }

        return `<ul>${items.join("")}</ul>`;
    };

    this.addErrorMessage = function(_errorMsg) {
        errorMessages.push(_errorMsg);

        docPanelDOMEl.innerHTML = buildListFromErrorMessages();

        docPanelDOMEl.classList.remove("zb-hide");
    };

    this.clear = function() {
        errorMessages.length = 0;
        docPanelDOMEl.classList.add("zb-hide");
    };
};

export { ZBCriticalErrorPanel }
