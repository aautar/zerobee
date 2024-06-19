import test from 'ava';
import { QueryExtractor } from '../../src/URL/QueryExtractor.mjs';

test('extractKeyValuePairs() returns object with query key/value pairs', t => {
    const queryKeyVals = QueryExtractor.extractKeyValuePairs("a=1&b=2&c=3");

    t.assert(queryKeyVals['a'] === '1');
    t.assert(queryKeyVals['b'] === '2');
    t.assert(queryKeyVals['c'] === '3');
});
