import { PaperPlane } from 'paper-plane';
import markdownit from 'markdown-it';
import { OutlineExtractor } from '../HTMLMarkup/OutlineExtractor.mjs';
import { InternalLinkModifier } from '../HTMLMarkup/InternalLinkModifier.mjs';

const md = new markdownit();

self.onmessage = function(_msg) {
    PaperPlane.get(_msg.data.rootURL + _msg.data.path, new Map(), (_resp) => {
        let htmlConversionResult = md.render(_resp);

        if(_msg.internalLinkFormat === "hash") {
            htmlConversionResult = (new InternalLinkModifier().modifyToSupportHashNav(htmlConversionResult));
        }

        const outline = (new OutlineExtractor()).extract(htmlConversionResult);

        let title = _msg.data.slug;
        if(outline.length > 0) {
            title = outline[0].title;
        }

        postMessage(
            {
                "path": _msg.data.path,
                "slug": _msg.data.slug,
                "title": title,
                "html": htmlConversionResult,
                "outline": outline,
            }
        );
    });
}
