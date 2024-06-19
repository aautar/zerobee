import { Tag } from "./Tag.mjs";
import { TagReader } from "./TagReader.mjs";

const OutlineExtractor = function() {
    /**
     * 
     * This method should probably be moved to TagReader
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
     * @returns {Object[]}
     */
    const extractOutline = function(_htmlString) {
        const outline = [];
        const currentEntryParent = {
            "<h1>": null,
            "<h2>": null,
            "<h3>": null,
            "<h4>": null,
            "<h5>": null,
            "<h6>": null,
        };
    
        for(let i=0; i<_htmlString.length; i++) {
            if(_htmlString[i] === '<') {
                const tagInfo = TagReader.readTag(_htmlString, i);
                if(['<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>'].includes(tagInfo.tag)) {
                    const contents = readTagContents(_htmlString, i + tagInfo.tagWithAttributes.length); // from tag to /tag
                    const hIdAttrData = TagReader.readTagAttribute(_htmlString, i, "id");

                    let anchorFragmentId = "";
                    if(hIdAttrData.attributeValue === null) {
                        console.warn("Failed to get `id` attribute value from heading tag");
                    } else {
                        anchorFragmentId = hIdAttrData.attributeValue;
                    }

                    const newOutlineEntry = {
                        "title": contents,
                        "anchorFragmentId": anchorFragmentId,
                        "subTopics": [],
                    };

                    const higherLevelTag = Tag.getHigherLevelHeadingTag(tagInfo.tag);
                    let parentEntry = null;
                  
                    if(higherLevelTag !== null) {
                        parentEntry = currentEntryParent[higherLevelTag];
                    }
                    
                    if(parentEntry === null) {
                        outline.push(newOutlineEntry);
                        currentEntryParent['<h1>'] = newOutlineEntry;
                    } else {
                        parentEntry.subTopics.push(newOutlineEntry);
                        currentEntryParent[tagInfo.tag] = newOutlineEntry;
                    }
                }
            }
        }

        return outline;
    };

    /**
     * 
     * @param {String} _htmlDocStr 
     * @returns {Object}
     */
    this.extract = function(_htmlDocStr) {
        return extractOutline(_htmlDocStr)
    };
};

export { OutlineExtractor }
