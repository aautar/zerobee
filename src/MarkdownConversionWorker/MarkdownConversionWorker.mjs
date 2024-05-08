import { PaperPlane } from 'paper-plane';
import markdownit from 'markdown-it';

const md = new markdownit();

self.onmessage = function(_msg) {
    PaperPlane.get(_msg.data.rootURL + _msg.data.path, new Map(), (_resp) => {
        // grab title
        let title = "";
        let foundStartChar = false;
        for(let i=0; i<_resp.length; i++) {
            if(_resp[i] === ' ' || _resp[i] === '\n' || _resp[i] === '#') {
                if(foundStartChar) {
                    break;
                } else {
                    continue;
                }
            }

            foundStartChar = true;
            title += _resp[i];
        }

        title = title.trim();


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
