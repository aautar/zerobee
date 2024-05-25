import test from 'ava';
import { TagReader } from '../../src/HTMLMarkup/TagReader.mjs';

test('readTag() returns object with tag name, for tag without attributes', t => {
    const tagInfo = TagReader.readTag(`<h1>Head</h1>`, 0);
    t.assert(tagInfo.tag === `<h1>`);
});

test('readTag() returns object with tag name, for tag with attributes', t => {
    const tagInfo = TagReader.readTag(`<a href="https://test.com">test link</a>`, 0);
    t.assert(tagInfo.tag === `<a>`);
});

test('readTag() returns object with entire tag string', t => {
    const tagInfo = TagReader.readTag(`<a href="https://test.com">test link</a>`, 0);
    t.assert(tagInfo.tagWithAttributes === `<a href="https://test.com">`);
});
