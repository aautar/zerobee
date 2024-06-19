import { DOMOps } from "./DOMOps.mjs";

const ZBCriticalErrorPanel = function(_parentDOMElement) {
    const self = this;

    const docPanelDOMEl = DOMOps.appendHTML(
        _parentDOMElement, 
        `
            <div class="zb-hide zb-critical-error">
                <div class="messages"></div>
                <div><a class="btn-hide" href="#">Close</a></div>
            </div>
        `,
        true
    );

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

        docPanelDOMEl.getElementsByClassName('messages')[0].innerHTML = buildListFromErrorMessages();

        docPanelDOMEl.classList.remove("zb-hide");
    };

    this.clear = function() {
        errorMessages.length = 0;
        docPanelDOMEl.classList.add("zb-hide");
    };

    docPanelDOMEl.getElementsByClassName('btn-hide')[0].addEventListener('click', function(_e) {
        _e.preventDefault();
        self.clear();
    });
};

export { ZBCriticalErrorPanel }
