'use strict';
const utils = require('./utils.cjs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const config = require('../config/index.cjs');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf.cjs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('@soda/friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  optimization: {
    emitOnErrors: false, // explicitly disable emitting
  },
  devServer: {
    client: {
      logging: 'warn',
      overlay: { 
        warnings: false, 
        errors: true 
      },
    },
    static: {
      publicPath: '/oppija-raamit/',
      directory: config.common.contentBase,
    },
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
    watchFiles: {
      options: {
        usePolling: false,
      }
    },
    devMiddleware: {
      writeToDisk: true
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({patterns: [
      {
        from: '**/*',
        // kopioi output/path parametrin osoittamaan polkuun
        context: 'static/',
        globOptions: {
          ignore: ['.*']
        }
      }
    ]}),
    new HtmlWebpackPlugin({
      title: "Oppija-raamit",
      template: 'index.html',
      inject: 'head'
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
