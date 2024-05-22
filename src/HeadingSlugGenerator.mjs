const HeadingSlugGenerator = {
    /**
     * 
     * @param {String} _headingText 
     * @returns {String}
     */
    generate: function(_headingText) {
        return (_headingText.toLowerCase()).replaceAll(' ', '-');
    }
};

export { HeadingSlugGenerator }
