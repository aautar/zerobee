const QueryExtractor = {
    /**
     * 
     * @param {String} _query 
     * @returns {Object}
     */
    extractKeyValuePairs: function(_query) {
        const result = {};

        const queryParts = _query.split('&');
        queryParts.forEach((_qp) => {
            const queryKeyVal = _qp.split('=');
            result[queryKeyVal[0]] = queryKeyVal[1];
        });

        return result;
    }
};

export { QueryExtractor }
