const Tag = {
    /**
     * 
     * @param {String} _tag 
     * @returns {Boolean}
     */
    isHeadingStartTag: function(_tag) {
        if(
            _tag === '<h1>' ||
            _tag === '<h2>' ||
            _tag === '<h3>' ||
            _tag === '<h4>' ||
            _tag === '<h5>' ||
            _tag === '<h6>' 
        ) {
            return true;
        }

        return false;
    },

    /**
     * 
     * @param {String} _tag 
     * @returns {Boolean}
     */
    isClosingHeaderTag: function(_tag) {
        return ["</h1>","</h2>","</h3>","</h4>","</h5>","</h6>"].includes(_tag);
    },


    /**
    * 
    * @param {String} _tag 
    * @returns {String|null}
    */
    getHigherLevelHeadingTag: function(_htag) {
       switch(_htag) {
           case "<h2>": return "<h1>";
           case "<h3>": return "<h2>";
           case "<h4>": return "<h3>";
           case "<h5>": return "<h4>";
           case "<h6>": return "<h5>";
           default: return null;
       }
   }
};

export { Tag }
