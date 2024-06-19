import { DOMOps } from './DOMOps.mjs';
import { ZBCriticalErrorPanel } from './ZBCriticalErrorPanel.mjs';
import { ZBDocDisplayPanel } from './ZBDocDisplayPanel.mjs';
import { ZBDocOutlinePanel } from './ZBDocOutlinePanel.mjs';
import { ZBLoadingPanel } from './ZBLoadingPanel.mjs';
import { ZBMenu } from './ZBMenu.mjs';

const PageScaffolder = {
    /**
     * 
     * @param {Document} _document 
     */
    _setupCoreStyles: function(_document) {
        const cssStyles = `
            * { padding:0; margin:0; text-decoration:none; font-family: "Arial"; font-size:16px; color:#ccc; font-weight:normal; border: none; box-sizing:border-box; text-align:left; }
            ul, li { list-style: none; }
            body { background: #262626; }

            /* Document styles */
            h1 { 
                margin: 0 0 12px 0;
                font-size: 38px; 
            }

            h2 { 
                margin: 20px 0 12px 0;
                font-size: 28px; 
            }

            h3 { 
                margin: 20px 0 12px 0;
                font-size: 24px; 
            }

            h4 { 
                margin: 20px 0 12px 0;
                font-size: 20px; 
            }

            h5 { 
                margin: 20px 0 12px 0;
                font-size: 18px; 
            }

            h6 { 
                margin: 20px 0 12px 0;
                font-size: 16px; 
            }

            hr {
                border-top: 1px solid #606060;
                margin: 16px 0;
            }

            b, strong {
                font-weight: bold;
            }

            em {
                font-style: italic;
            }

            s {
                text-decoration: line-through;
            }

            p {
                margin-bottom: 20px;
            }

            blockquote {
                display: block;
                border-left: 4px solid #5c5c5c;
                padding: 4px 16px;
            }

            blockquote p:last-child {
                margin-bottom: 0;
            }


            ol, ul {
                padding-left: 32px;
                margin-bottom: 20px;
            }

            ul ul, ul ol, ol ul, ol ol {
                margin-bottom: 0;
            }

            ul li {
                margin: 20px 0;
                list-style-type: disc;
            }

            ol li {
                margin: 20px 0;
                list-style-type: decimal;
            }

            pre {
                display: block;
                margin-bottom: 20px;
            }

            code {
                font-family: 'Courier New', Courier, monospace;
                display: inline-block;
                background: #333;
                padding: 2px 4px;
            }

            pre code {
                display: block;
                padding: 12px;
            }


            table {
                table-layout: auto;
                width: auto;
                border-collapse: collapse;
                margin-bottom: 20px;
            }

            thead {
                background-color: #333;
            }

            th {
                font-weight: bold;
            }

            th, td { 
                padding: 12px 16px;
            }

            a {
                color: #788bff;
            }

            a:hover {
                text-decoration: underline;
            }

            h1 .permalink, h2 .permalink, h3 .permalink, h4 .permalink, h5 .permalink, h6 .permalink {
                font-size: inherit;
                text-decoration: none;
                filter: grayscale(1) opacity(0);
                transition: filter 0.15s ease-in-out;
                margin-left: 8px;
            }

            h1:hover .permalink, h2:hover .permalink, h3:hover .permalink, h4:hover .permalink, h5:hover .permalink, h6:hover .permalink {
                filter: grayscale(0) opacity(1);
            }

            /* ZeroBee component styles */
            .zb-hide { display: none }

            .zb-page-wrapper {
                padding: 20px;
                display: grid;
                grid-template-columns: 320px 1fr 280px;
                gap: 16px;
            }

            .zb-menu, .zb-current-doc-outline {
                position: sticky;
                top: 20px;
                height: calc(100vh - 40px); /* 40px to account for top and bottom padding */
            }

            .zb-submenu {
                padding: 0px 8px;
            }

            .zb-menu-item {
                list-style-type: none;
                margin: 12px 0;
            }

            .zb-menu-link, .zb-menu-section-link {
                color: #ccc;
                font-weight: 400;
                text-decoration: none;
            }

            .zb-menu-link:hover, .zb-menu-section-link:hover {
                color: #fff;
                text-decoration: none;
            }

            .zb-menu-link.zb-active {
                color: #788bff;
            }

            .zb-critical-error {
                position: fixed;
                background: #400;
                padding: 8px;
                opacity: 0.95;
                width: calc(100vw - (100vw - 100%)); /* viewport width minus scrollbar, https://stackoverflow.com/a/34884924 */
                top: 0;
                z-index: 100;
                display: grid;
                grid-template-columns: 1fr 100px;
                gap: 16px;
                align-items: center;
            }

            .zb-critical-error.zb-hide {
                display: none;
            }

            .zb-loading-panel {
                position: fixed;
                background: #262626;
                color: #fff;
                width: 100vw;
                height: 100vh;
                top: 0;
                left: 0;
                display: grid;
                align-items: center;
                justify-content: center;
                transition: filter 0.5s ease-in-out, opacity 0.5s ease-in-out;
            }

            .zb-loading-panel .message {
                transition: filter 0.2s ease-in-out, opacity 0.2s ease-in-out;
                filter: blur(0);
                opacity: 1;
            }

            .zb-loading-panel .message.zb-pre-hide {
                filter: blur(8px);
                opacity: 0;
            }

            .zb-loading-panel.zb-pre-hide {
                opacity: 0;
            }

            .zb-loading-panel.zb-hide {
                display: none;
            }
        `;

        _document.head.insertAdjacentHTML("beforeend", `<style>${cssStyles}</style>`)
    },

    /**
     * 
     * @param {Document} _document 
     */
    setupPage: function(_document) {
        this._setupCoreStyles(_document);

        const bodyElem = _document.body;

        const wrapperElement = DOMOps.appendHTML(bodyElem, `<div class="zb-page-wrapper"></div>`);

        const menu = new ZBMenu(wrapperElement);
        const docDisplayPanel = new ZBDocDisplayPanel(wrapperElement);
        const criticalErrorPanel = new ZBCriticalErrorPanel(document.body);
        const docOutlinePanel = new ZBDocOutlinePanel(wrapperElement);
        const loadingPanel = new ZBLoadingPanel(document.body);

        return {
            "menu": menu,
            "docDisplayPanel": docDisplayPanel,
            "criticalErrorPanel": criticalErrorPanel,
            "docOutlinePanel": docOutlinePanel,
            "loadingPanel": loadingPanel,
        };
    }
};

export { PageScaffolder }
