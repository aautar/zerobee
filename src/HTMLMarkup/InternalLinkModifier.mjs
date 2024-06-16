import { TagReader } from "./TagReader.mjs";

const InternalLinkModifier = function() {
    /**
     * 
     * @param {String} _href 
     * @returns {Boolean}
     */
    const isRelativeHref = function(_href) {
        if(
            _href.startsWith(`"//`) || 
            _href.startsWith(`"http://`) || 
            _href.startsWith(`"https://`) || 
            _href.startsWith(`'//`) || 
            _href.startsWith(`'http://`) || 
            _href.startsWith(`'https://`)
        ) {
            return false;
        }

        return true;
    };

    /**
     * 
     * @param {String} _htmlString 
     * @returns {String}
     */
    this.modifyToSupportHashNav = function(_htmlString) {
        const replacementMap = new Map();

        for(let i=0; i<_htmlString.length; i++) {
            if(_htmlString[i] === '<') {
                const tagInfo = TagReader.readTag(_htmlString, i);

                if(tagInfo.tag === '<a>') {
                    const attrInfo = TagReader.readTagAttribute(_htmlString, i, "href");
                    console.log(attrInfo);
                    
                    if(isRelativeHref(attrInfo.attributeValue)) {
                        const curFullTagString = tagInfo.tagWithAttributes;

                        const updatedAttributeValue = '#' + attrInfo.attributeValue;
                        const fullTagStringUpdated = curFullTagString.replaceAll(attrInfo.attributeValue, updatedAttributeValue);

                        replacementMap.set(curFullTagString, fullTagStringUpdated);
                    }
                }
            }
        }

        for (const [find, replace] of replacementMap) {
            _htmlString = _htmlString.replaceAll(find, replace);
        }

        return _htmlString;
    };
};

export { InternalLinkModifier }
