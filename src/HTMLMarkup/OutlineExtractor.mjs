
const OutlineExtractor = function() {
    const readTag = function(_htmlString, _startIndex) {
        let tag = "";
        for(let i=_startIndex; i<_htmlString.length; i++) {
            tag += _htmlString[i];
            if(_htmlString[i] === '>') {
                break;
            }
        }
    
        return tag;
    };

    /**
     * 
     * @param {String} _tag 
     * @returns {String|null}
     */
    const getHigherLevelTag = function(_tag) {
        switch(_tag) {
            case "<h2>": return "<h1>";
            case "<h3>": return "<h2>";
            case "<h4>": return "<h3>";
            case "<h5>": return "<h4>";
            case "<h6>": return "<h5>";
            default: return null;
        }
    };

    /**
     * 
     * @param {String} _tag 
     * @returns {Boolean}
     */
    const isClosingHeaderTag = function(_tag) {
        return ["</h1>","</h2>","</h3>","</h4>","</h5>","</h6>"].includes(_tag);
    };

    const readTagContents = function(_htmlString, _startIndex) {
        let content = "";
        for(let i=_startIndex; i<_htmlString.length; i++) {
            if(_htmlString[i] === '<') {
                // read tag
                const tag = readTag(_htmlString, i);
                if(isClosingHeaderTag(tag)) {
                    break;
                } else {
                    i += tag.length - 1;
                    continue;
                }
            }

            content += _htmlString[i];
        }
    
        return content;
    };
   
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
                const tag = readTag(_htmlString, i);
                if(['<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>'].includes(tag)) {
                    const contents = readTagContents(_htmlString, i + tag.length); // from tag to /tag

                    const newOutlineEntry = {
                        "title": contents,
                        "anchorFragmentId": "",
                        "subTopics": [],
                    };

                    const higherLevelTag = getHigherLevelTag(tag);
                    let parentEntry = null;
                  
                    if(higherLevelTag !== null) {
                        parentEntry = currentEntryParent[higherLevelTag];
                    }
                    
                    if(parentEntry === null) {
                        outline.push(newOutlineEntry);
                        currentEntryParent['<h1>'] = newOutlineEntry;
                    } else {
                        parentEntry.subTopics.push(newOutlineEntry);
                        currentEntryParent[tag] = newOutlineEntry;
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
