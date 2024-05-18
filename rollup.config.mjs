// rollup.config.js
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import stringifyCode from 'rollup-plugin-stringify-code';
import indexHtmlPackage from './build/rollup-plugin-index-html-package.mjs'

const babelConfig = {
  babelrc: false,
  presets: [
    [
      '@babel/env', 
      {
        targets: {
          "chrome": "100"
        },
      }
    ],          
    [
      'minify', 
      {
        builtIns: false,
        deadcode: false,
        mangle: false,
      }
    ],
  ],
  comments: false,
};

export default [
  {
    input: 'src/MarkdownConversionWorker/MarkdownConversionWorker.mjs',
    output: {
      format: 'esm',
      file: 'dist/markdown-conversion-worker.min.mjs',
      name: 'MarkdownConversionWorker',
    },
    plugins: [
      nodeResolve(),
      babel(babelConfig),
      stringifyCode(
        {
          "exportVarName": "MarkdownConversionWorkerJsString",
          "srcBundleName": "markdown-conversion-worker.min.mjs",
          "dest": "src/MarkdownConversionWorker/MarkdownConversionWorker.string.mjs"
        }
      )
    ],
  },
  {
    input: ['src/ZeroBee.mjs'],
    output: {
      format: 'esm',
      file: 'dist/zerobee.min.mjs',
      name: 'ZeroBee'
    },
    plugins: [
      nodeResolve(), 
      babel(babelConfig),
      indexHtmlPackage(
        {
          "srcBundleName": "zerobee.min.mjs",
          "sourceCodeExportedVar": "ZeroBee",
          "dest": ["dist/index.html", "example/index.html"],
        }
      )
    ],
  },
];
