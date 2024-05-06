const DOMOps = {
    /**
     * 
     * @param {Element} _parentElement 
     * @param {String} _childElementHtml
     * @param {Boolean} _trimHtml
     * @returns {Element}
     */
    appendHTML: function(_parentElement, _childElementHtml, _trimHtml) {
        const wrapperElem = document.createElement('div');
        wrapperElem.innerHTML = (_trimHtml) ? _childElementHtml.trim() : _childElementHtml;
        const firstChild = wrapperElem.childNodes[0];
        
        while(wrapperElem.childNodes.length > 0) {
            _parentElement.appendChild(wrapperElem.childNodes[0]);
        }
        
        return firstChild;
    },
};

export { DOMOps }
