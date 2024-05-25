import test from 'ava';
import { InternalLinkModifier } from '../../src/HTMLMarkup/InternalLinkModifier.mjs';

test('modifyToSupportHashNav() returns updated HTML string with internal links prefixed with hash ', t => {
    const expectedUpdatedHtml = `
        <!DOCTYPE html>
        <html>
            <head></head>
            <body>
                <div>
                    <a href="#test/subpage">subpage</a>
                </div>
            </body>
        </html>
    `;

    const html = `
        <!DOCTYPE html>
        <html>
            <head></head>
            <body>
                <div>
                    <a href="test/subpage">subpage</a>
                </div>
            </body>
        </html>
    `;

    const linkModifier = new InternalLinkModifier();
    const updatedHTML = linkModifier.modifyToSupportHashNav(html);

    t.assert(updatedHTML === expectedUpdatedHtml);
});
