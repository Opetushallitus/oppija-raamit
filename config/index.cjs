'use strict';

const path = require('path');

module.exports = {
  common: {
    contentBase: path.resolve(__dirname, '../src/main/resources/public')
  },
  build: {
    // Paths
    assetsRoot: path.resolve(__dirname, '../src/main/resources/public'),
    assetsSubDirectory: '',
    assetsPublicPath: '/oppija-raamit',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
