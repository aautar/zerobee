import { DOMOps } from "./DOMOps.mjs";

const ZBLoadingPanel = function(_parentDOMElement) {
    const self = this;

    const docPanelDOMEl = DOMOps.appendHTML(
        _parentDOMElement, 
        `
            <div class="zb-hide zb-loading-panel">
                <div class="message">Loading...</div>
            </div>
        `,
        true
    );

    this.show = function() {
        docPanelDOMEl.classList.remove('zb-hide');
    };

    this.hide = function(_loadStartTime) {
        const minDisplayTime = 500;
        const timeElapsed = (new Date()) - _loadStartTime;
        let remainingDisplayTime = minDisplayTime - timeElapsed;

        if(remainingDisplayTime < 0) {
            remainingDisplayTime = 0;
        }

        setTimeout(function() {
            docPanelDOMEl.getElementsByClassName('message')[0].classList.add('zb-pre-hide');

            setTimeout(function() {
                docPanelDOMEl.classList.add('zb-pre-hide');

                setTimeout(function() {
                    docPanelDOMEl.classList.add("zb-hide");
                }, 500);
                
            }, 250);

        }, remainingDisplayTime);
    };
};

export { ZBLoadingPanel }
