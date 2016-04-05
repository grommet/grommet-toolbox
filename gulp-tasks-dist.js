import gulpWebpack from 'webpack-stream';
import path from 'path';
import yargs from 'yargs';
const argv = yargs.argv;

import gulpOptionsBuilder from './gulp-options-builder';
import gulpTasksCore from './gulp-tasks-core';
import gulpTasksTest from './gulp-tasks-test';
import gulpTasksLinters from './gulp-tasks-linters';

export function distTasks (gulp, opts) {

  const runSequence = require('run-sequence').use(gulp);

  gulpTasksCore(gulp, opts);
  gulpTasksTest(gulp, opts);
  gulpTasksLinters(gulp, opts);

  const options = gulpOptionsBuilder(opts);

  gulp.task('dist-preprocess', (callback) => {
    if (argv.skipPreprocess) {
      callback();
    } else if (options.distPreprocess) {
      if (process.env.CI) {
        runSequence('preprocess', options.distPreprocess, 'copy', callback);
      } else {
        runSequence('preprocess', options.distPreprocess, 'copy', 'test', callback);
      }
    } else {
      if (process.env.CI) {
        runSequence('preprocess', callback);
      } else {
        runSequence('preprocess', 'test', callback);
      }
    }
  });

  gulp.task('dist', ['dist-preprocess'], () => {

    let webpackConfigPath = path.resolve(
      __dirname, 'webpack.dist.config.babel.js'
    );

    if (argv.config) {
      webpackConfigPath = path.resolve(argv.config);
    }

    const config = require(webpackConfigPath);

    return gulp.src(options.mainJs)
      .pipe(gulpWebpack(config))
      .pipe(gulp.dest(options.dist));
  });
};

export default distTasks;
