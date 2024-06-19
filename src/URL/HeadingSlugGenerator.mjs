const HeadingSlugGenerator = {
    /**
     * 
     * @param {String} _headingText 
     * @returns {String}
     */
    generate: function(_headingText) {
        return encodeURIComponent((_headingText.toLowerCase()).replaceAll(' ', '-'));
    }
};

export { HeadingSlugGenerator }
