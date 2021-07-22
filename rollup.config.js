/* eslint-disable import/no-extraneous-dependencies */
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const legacy = require('@rollup/plugin-legacy');
const { babel } = require('@rollup/plugin-babel');
const alias = require('@rollup/plugin-alias');
const fs = require('fs');

const plugins = [
    alias({
        entries: [{
            // Dedupe NodeList.forEach() included in both hmrc-frontend and
            // govuk-frontend
            find: /.*common$/,
            replacement: 'govuk-frontend-src/src/govuk/common.js'
        }, {
            // HMRC are bundling already bundled GOVUK polyfills, map to originals
            find: /govuk-frontend\/govuk\/vendor\/polyfills/,
            replacement: 'govuk-frontend-src/src/govuk/vendor/polyfills'
        }]
    }),
    legacy({}),
    nodeResolve(),
    // HMRC use ES6 js in their TimeoutDialog code, so we need to babel it out
    babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        include: ['node_modules/hmrc-frontend-src/**/*']
    }),
    terser({ ie8: true })
]

const createConfig = (file, outputFile) => ({
    input: `${file}`,
    output: [
        {
            file: `public/javascript/${outputFile}`,
            format: 'umd',
            name: 'GOVUKFrontend',
            // The GOVUKFrontend bundle is inited in this file, which also contains
            // non-bundleable custom CASA js.
            outro: fs.readFileSync(require.resolve('@dwp/govuk-casa/src/js/casa.js'))
        }
    ],
    plugins
});

module.exports = [
    createConfig('assets/hmrc/all.js', 'ui-fitnote-frontend.js')
]
