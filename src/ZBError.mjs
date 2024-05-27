/**
 * 
 * @param {String} _code 
 * @param {String} _message 
 */
const ZBError = function(_code, _message) {
    /**
     * 
     * @returns {String}
     */
    this.getCode = function() {
        return _code;
    };

    /**
     * 
     * @returns {String}
     */
    this.getMessage = function() {
        return _message;
    };
};

export { ZBError }
