import test from 'ava';
import { OutlineExtractor } from '../../src/HTMLMarkup/OutlineExtractor.mjs';

test('extract() returns entry with correct title for <h1> tag', t => {
    const html = `<!DOCTYPE html>
        <html>
            <body>
                <h1>First Heading</h1>
            </body>
        </html>
    `

    const extractor = new OutlineExtractor();
    const outline = extractor.extract(html);

    t.assert(outline.length === 1);
	t.assert(outline[0].title === "First Heading");
});

test('extract() returns entries such that <h2> entry is sub-topic of <h1> entry', t => {
    const html = `<!DOCTYPE html>
        <html>
            <body>
                <h1>First Heading</h1>
                <p>Something...</p>
                <h2>Second Heading</h2>
                <p>Something...</p>
            </body>
        </html>
    `

    const extractor = new OutlineExtractor();
    const outline = extractor.extract(html);

    t.assert(outline.length === 1);
	t.assert(outline[0].title === "First Heading");
    t.assert(outline[0].subTopics.length === 1);
    t.assert(outline[0].subTopics[0].title === "Second Heading");
});

test('extract() returns entries such that <h3> entry is sub-topic of <h2> entry', t => {
    const html = `<!DOCTYPE html>
        <html>
            <body>
                <h1>First Heading</h1>
                <p>Something...</p>
                <h2>Second Heading</h2>
                <p>Something...</p>
                <h3>Third Heading</h3>
                <p>Something...</p>
            </body>
        </html>
    `

    const extractor = new OutlineExtractor();
    const outline = extractor.extract(html);

    t.assert(outline.length === 1);
	t.assert(outline[0].title === "First Heading");
    t.assert(outline[0].subTopics.length === 1);
    t.assert(outline[0].subTopics[0].title === "Second Heading");
    t.assert(outline[0].subTopics[0].subTopics.length === 1);
    t.assert(outline[0].subTopics[0].subTopics[0].title === "Third Heading");
});

test('extract() extracts title from tag within header tag', t => {
    const html = `<!DOCTYPE html>
        <html>
            <body>
                <h1><a href="#">First Heading</a></h1>
            </body>
        </html>
    `

    const extractor = new OutlineExtractor();
    const outline = extractor.extract(html);

    t.assert(outline.length === 1);
	t.assert(outline[0].title === "First Heading");
});
