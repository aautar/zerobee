import test from 'ava';
import { Tag } from '../../src/HTMLMarkup/Tag.mjs';

test('isHeadingStartTag() returns true for heading start tag', t => {
    t.true(Tag.isHeadingStartTag("<h1>"));
    t.true(Tag.isHeadingStartTag("<h2>"));
    t.true(Tag.isHeadingStartTag("<h3>"));
    t.true(Tag.isHeadingStartTag("<h4>"));
    t.true(Tag.isHeadingStartTag("<h5>"));
    t.true(Tag.isHeadingStartTag("<h6>"));
});

test('isHeadingStartTag() returns false for heading closing tag', t => {
    t.false(Tag.isHeadingStartTag("</h1>"));
});

test('isHeadingStartTag() returns false for non-heading start tag', t => {
    t.false(Tag.isHeadingStartTag("<p>"));
});

test('isClosingHeaderTag() returns true for closing heading tag', t => {
    t.true(Tag.isClosingHeaderTag("</h1>"));
    t.true(Tag.isClosingHeaderTag("</h2>"));
    t.true(Tag.isClosingHeaderTag("</h3>"));
    t.true(Tag.isClosingHeaderTag("</h4>"));
    t.true(Tag.isClosingHeaderTag("</h5>"));
    t.true(Tag.isClosingHeaderTag("</h6>"));
});

test('isClosingHeaderTag() returns false for non-closing heading tag', t => {
    t.false(Tag.isClosingHeaderTag("<h1>"));
});

test('isClosingHeaderTag() returns false for non-heading tag', t => {
    t.false(Tag.isClosingHeaderTag("<p>"));
});

test('getHigherLevelHeadingTag() returns higher level tag for h2-h6 tags', t => {
    t.assert(Tag.getHigherLevelHeadingTag("<h2>"), "<h1>");
    t.assert(Tag.getHigherLevelHeadingTag("<h3>"), "<h2>");
    t.assert(Tag.getHigherLevelHeadingTag("<h4>"), "<h3>");
    t.assert(Tag.getHigherLevelHeadingTag("<h5>"), "<h4>");
    t.assert(Tag.getHigherLevelHeadingTag("<h6>"), "<h5>");
});

test('getHigherLevelHeadingTag() returns null for h1 tag', t => {
    t.true(Tag.getHigherLevelHeadingTag("<h1>") === null);
});

test('getHigherLevelHeadingTag() returns null for non-heading tag', t => {
    t.true(Tag.getHigherLevelHeadingTag("<p>") === null);
});
