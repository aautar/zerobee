import { PaperPlane } from 'paper-plane';
import markdownit from 'markdown-it';
import { OutlineExtractor } from '../HTMLMarkup/OutlineExtractor.mjs';
import { InternalLinkModifier } from '../HTMLMarkup/InternalLinkModifier.mjs';
import { HeadingIDApplier } from '../HTMLMarkup/HeadingIDApplier.mjs';

const md = new markdownit();

self.onmessage = function(_msg) {
    const fullURL = _msg.data.rootURL + _msg.data.path;
    PaperPlane.get(fullURL, 
        new Map(), 
        (_resp) => {
            let htmlConversionResult = md.render(_resp);

            if(_msg.data.internalLinkFormat === "hash") {
                htmlConversionResult = (new InternalLinkModifier().modifyToSupportHashNav(htmlConversionResult));
            }

            htmlConversionResult = (new HeadingIDApplier().apply(htmlConversionResult));

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
                    "error": null,
                }
            );
        },
        (_err, _xhr) => {
            if(_xhr.status === 404) {
                postMessage(
                    {
                        "path": _msg.data.path,
                        "slug": _msg.data.slug,
                        "title": null,
                        "html": null,
                        "outline": null,
                        "error": {
                            "message": `Unable to find ${_msg.data.path}`
                        }
                    }
                );
            }
        }
    );
}
