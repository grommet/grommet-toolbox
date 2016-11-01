import gulpWebpack from 'webpack-stream';
import path from 'path';

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
    if (!options.argv.preprocess) {
      callback();
      return;
    }

    if (options.distPreprocess) {
      if (process.env.CI) {
        runSequence('preprocess', options.distPreprocess, 'copy', callback);
      } else {
        runSequence('preprocess', options.distPreprocess, 'copy', 'test:coverage', callback);
      }
    } else {
      if (process.env.CI) {
        runSequence('preprocess', 'copy', callback);
      } else {
        runSequence('preprocess', 'copy', 'test:coverage', callback);
      }
    }
  });

  gulp.task('dist', ['dist-preprocess'], (done) => {

    let webpackConfigPath = path.resolve(
      __dirname, 'webpack.dist.config.js'
    );

    if (options.argv.config) {
      webpackConfigPath = path.resolve(options.argv.config);
    }

    const config = require(webpackConfigPath);

    if (Array.isArray(config)) {
      var doneCount = 0;
      config.forEach((c, index) => {
        gulp.src(options.mainJs)
          .pipe(gulpWebpack(c))
          .pipe(gulp.dest(options.dist)).on('end', () => {
            doneCount++;
            if (doneCount === config.length) {
              done();
            }
          });
      });
    } else {
      gulp.src(options.mainJs)
        .pipe(gulpWebpack(config))
        .pipe(gulp.dest(options.dist)).on('end', done);
    }
  });
};

export default distTasks;
