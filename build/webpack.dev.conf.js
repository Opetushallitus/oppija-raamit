'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('../config');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const StaticI18nHtmlPlugin = require('webpack-static-i18n-html');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/oppija-raamit/', 'index.html') },
      ],
    },
    hot: true,
    compress: true,
    host: HOST || 'localhost',
    port: PORT || '8080',
    open: false, // auto open browser
    overlay: { warnings: false, errors: true },
    contentBase: config.common.contentBase,
    publicPath: '/oppija-raamit/',
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
  plugins: [
    /*
    new StaticI18nHtmlPlugin({
      locale: 'fi',
      locales: ['fi', 'sv', 'en'],
      baseDir: path.posix.join( __dirname, '..'),
      outputDir: 'static/html',
      outputDefault: '__lng__/__file__',
      localesPath: 'src/locales',
      files: 'src/templates/*.html'
    }),
    */
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: "Oppija-raamit",
      template: 'index.html',
      inject: true
    })
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || '8080';
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: utils.createNotifierCallback()
      }));

      resolve(devWebpackConfig)
    }
  })
});
