import test from 'ava';
import { HeadingSlugGenerator } from '../../src/URL/HeadingSlugGenerator.mjs';

test('generate() lowercase string with spaces converted to dashes', t => {
    const slug = HeadingSlugGenerator.generate("Hello World");
    t.assert(slug, "hello-world");
});
