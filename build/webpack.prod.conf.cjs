'use strict';
const path = require('path');
const utils = require('./utils.cjs');
const config = require('../config/index.cjs');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf.cjs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/oppija-raamit-[id].js')
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ],
  },
  plugins: [
    // copy custom static assets
    new CopyWebpackPlugin({patterns: [
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        globOptions: {
          ignore: ['.*']
        }
      },
      {
        from: path.resolve(__dirname, '../static/index-prod.html'),
        to: path.posix.join(config.build.assetsSubDirectory, "index.html"),
      }
    ]})

  ]
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
