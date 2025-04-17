/* eslint-disable import/no-extraneous-dependencies */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import legacy from '@rollup/plugin-legacy';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import fs from 'fs';

const plugins = [
  alias({
    entries: [{
      // Dedupe NodeList.forEach() included in both hmrc-frontend and
      // govuk-frontend
      find: /.*common$/,
      replacement: 'govuk-frontend/govuk-esm/common.mjs',
    }],
  }),
  legacy({}),
  nodeResolve(),
  // HMRC use ES6 js in their TimeoutDialog code, so we need to babel it out
  babel({
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env'],
    include: ['node_modules/hmrc-frontend-src/**/*'],
  }),
  terser({ ie8: true }),
];

const createConfig = (file, outputFile) => ({
  input: `${file}`,
  output: [
    {
      file: `public/javascript/${outputFile}`,
      format: 'umd',
      name: 'GOVUKFrontend',
      // The GOVUKFrontend bundle is inited in this file, which also contains
      // non-bundleable custom CASA js.
      outro: fs.readFileSync(require.resolve('@dwp/govuk-casa/src/js/casa.js')),
    },
  ],
  plugins,
});

export default [
  createConfig('assets/hmrc/all.js', 'ui-fitnote-frontend.js'),
];
