import { PaperPlane } from 'paper-plane';
import markdownit from 'markdown-it';

const md = new markdownit();

self.onmessage = function(_msg) {
    console.log(_msg);
    PaperPlane.get(_msg.data.rootURL + _msg.data.path, new Map(), (_resp) => {
        const htmlConversionResult = md.render(_resp);
        postMessage(
            {
                "path": _msg.data.path,
                "slug": _msg.data.slug,
                "html": htmlConversionResult,
            }
        );
    });
}
