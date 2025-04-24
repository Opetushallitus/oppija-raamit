'use strict';

import ora from 'ora';
import { rimraf } from 'rimraf';
import { join } from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import webpackConfig from './webpack.prod.conf.cjs';
import config from '../config/index.cjs';

const spinner = ora('building for production...');
spinner.start();

rimraf(join(config.build.assetsRoot, config.build.assetsSubDirectory))
  .then(() => {
    // Perform webpack build
    webpack(webpackConfig, (err, stats) => {
      spinner.stop();
      if (err) throw err;
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      }) + '\n\n');

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'));
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
  .catch(err => { throw err; });
