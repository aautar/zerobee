const TagReader = {
    /**
     * 
     * @param {String} _htmlString 
     * @param {Number} _startIndex 
     * @returns {Object}
     */
    readTag: function(_htmlString, _startIndex) {
        const result = {
            "tag": null,
            "tagWithAttributes": null,
            "startIndex": _startIndex,
            "endIndex": null,
        };

        let buf = "";
        let finishedReadingTagName = false;
        for(let i=_startIndex; i<_htmlString.length; i++) {
            if(_htmlString[i] === '>') {
                buf += _htmlString[i];

                if(finishedReadingTagName === false) {
                    result.tag = buf;
                }

                result.tagWithAttributes = buf;
                result.endIndex = i;
                break;
            }

            if(finishedReadingTagName === false && _htmlString[i] === ' ') {
                result.tag = buf + '>';
                finishedReadingTagName = true;
            }

            buf += _htmlString[i];
        }

        return result;
    },

    /**
     * 
     * @param {String} _htmlString 
     * @param {Number} _tagStartIndex 
     * @param {String} _attributeName 
     * @returns 
     */
    readTagAttribute: function(_htmlString, _tagStartIndex, _attributeName) {
        const result = {
            "entireTagString": null,
            "attributeName": null,
            "attributeValue": null,
        }

        let entireTagString = "";
        for(let i=_tagStartIndex; i<_htmlString.length; i++) {
            entireTagString += _htmlString[i];

            if(_htmlString[i] === '>') {
                break;
            }
        }

        result.entireTagString = entireTagString;

        const tagStringNoAngleBrackets = entireTagString.substring(1, entireTagString.length-1);
        const tagAttributeParts = tagStringNoAngleBrackets.split(' ');
        for(let i=0; i<tagAttributeParts.length; i++) {
            const attrKeyVal = tagAttributeParts[i].split('=');
            if(attrKeyVal[0] === _attributeName) {
                result.attributeName = _attributeName;
                result.attributeValue = attrKeyVal[1];

                // remove quotes
                if(result.attributeValue[0] === `'` || result.attributeValue[0] === `"`) {
                    result.attributeValue = result.attributeValue.substring(1, result.attributeValue.length - 1);
                }

                return result;
            }
        }
    
        return result;
    }
};

export { TagReader }
