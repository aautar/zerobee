const TagReader = {
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

        const tagAttributeParts = entireTagString.split(' ');
        for(let i=0; i<tagAttributeParts.length; i++) {
            const attrKeyVal = tagAttributeParts[i].split('=');
            if(attrKeyVal[0] === _attributeName) {
                result.attributeName = _attributeName;
                result.attributeValue = attrKeyVal[1];

                return result;
            }
        }
    
        return result;
    }
};

export { TagReader }
