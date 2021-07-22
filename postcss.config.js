/* eslint-disable import/no-extraneous-dependencies */
const autoprefixer = require('autoprefixer');
const postcssurl = require('postcss-url');
const oldie = require('oldie');
const path = require('path');

const ie8 = process.env.IE8 === 'true' && oldie({
  rgba: { filter: true },
  rem: { disable: true },
  unmq: { disable: true },
  pseudo: { disable: true }
});

module.exports = {
  plugins: [
    autoprefixer,
    postcssurl([{
      url: 'copy',
      // base path to search assets from
      basePath: path.resolve('node_modules'),
      // dir to copy assets
      assetsPath: 'assets',
      // using hash names for assets (generates from asset content)
      useHash: true
    }]),
    ie8
  ]
};
