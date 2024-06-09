import { HeadingSlugGenerator } from "../HeadingSlugGenerator.mjs";
import { Tag } from "./Tag.mjs";
import { TagReader } from "./TagReader.mjs";

const HeadingIDApplier = function() {
    /**
     * 
     * @param {String} _htmlString 
     * @param {Number} _startIndex 
     * @returns {String}
     */
    const readTagContents = function(_htmlString, _startIndex) {
        let content = "";
        for(let i=_startIndex; i<_htmlString.length; i++) {
            if(_htmlString[i] === '<') {
                // read tag
                const tagInfo = TagReader.readTag(_htmlString, i);
                if(Tag.isClosingHeaderTag(tagInfo.tag)) {
                    break;
                } else {
                    i += tagInfo.tagWithAttributes.length - 1;
                    continue;
                }
            }

            content += _htmlString[i];
        }
    
        return content;
    };

    /**
     * 
     * @param {String} _htmlString 
     * @param {Number} _startIndex 
     * @returns {String}
     */
    const readTagContentsRaw = function(_htmlString, _startIndex) {
        let content = "";
        for(let i=_startIndex; i<_htmlString.length; i++) {
            if(_htmlString[i] === '<') {
                // read tag
                const tagInfo = TagReader.readTag(_htmlString, i);
                if(Tag.isClosingHeaderTag(tagInfo.tag)) {
                    break;
                }
            }

            content += _htmlString[i];
        }
    
        return content;
    };    

    /**
     * 
     * @param {String} _htmlString 
     */
    this.apply = function(_htmlString) {
        const headingSlugs = [];

        // We will go through this array and replace the first occurance of every "find" string
        // .. this allows for effectively dealing with duplicates
        const orderedReplacements = [];

        let headingStartTagInfo = null;
        for(let i=0; i<_htmlString.length; i++) {
            if(_htmlString[i] === '<') {
                const tagInfo = TagReader.readTag(_htmlString, i);

                if(Tag.isHeadingStartTag(tagInfo.tag)) {
                    headingStartTagInfo = tagInfo;
                    const headingStr = readTagContents(_htmlString, tagInfo.startIndex);
                    const headingStrRaw = readTagContentsRaw(_htmlString, tagInfo.startIndex);
                    let idStr = HeadingSlugGenerator.generate(headingStr);

                    while(headingSlugs.indexOf(idStr) >= 0) {
                        idStr = idStr + `-${Math.floor(Math.random()*100000).toString(16)}`;
                    }
                    
                    orderedReplacements.push(
                        {
                            "find": headingStrRaw,
                            "replace": tagInfo.tag.substring(0, tagInfo.tag.length-1) + ` id="${idStr}">${headingStrRaw.substring(4)}`
                        }
                    );

                    headingSlugs.push(idStr);
                }
            }
        }

        for(let i=0; i<orderedReplacements.length; i++) {
            _htmlString = _htmlString.replace(orderedReplacements[i].find, orderedReplacements[i].replace);
        }

        return _htmlString;
    };
};

export { HeadingIDApplier }
