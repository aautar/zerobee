import { PaperPlane } from 'paper-plane';
import markdownit from 'markdown-it';

const md = new markdownit();

/**
 * 
 * @param {String} _mkStr 
 * @returns {String}
 */
const extractTitleFromMarkdownString = function(_mkStr) {
    // grab title
    let title = "";
    let foundStartChar = false;
    for(let i=0; i<_mkStr.length; i++) {
        if(foundStartChar && _mkStr[i] === '\n') {
            break;
        }

        if(foundStartChar === false &&_mkStr[i] === ' ' || _mkStr[i] === '\n' || _mkStr[i] === '#') {
            continue;
        }

        foundStartChar = true;
        title += _mkStr[i];
    }

    return title.trim();
};

self.onmessage = function(_msg) {
    PaperPlane.get(_msg.data.rootURL + _msg.data.path, new Map(), (_resp) => {
        const title = extractTitleFromMarkdownString(_resp);
        const htmlConversionResult = md.render(_resp);
        postMessage(
            {
                "path": _msg.data.path,
                "slug": _msg.data.slug,
                "title": title.length > 0 ? title : _msg.data.slug,
                "html": htmlConversionResult,
            }
        );
    });
}
