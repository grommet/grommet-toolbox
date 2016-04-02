import gulpWebpack from 'webpack-stream';
import webpack from 'webpack';
import deepAssign from 'deep-assign';

import gulpOptionsBuilder from './gulp-options-builder';
import gulpTasksCore from './gulp-tasks-core';
import gulpTasksTest from './gulp-tasks-test';
import gulpTasksLinters from './gulp-tasks-linters';

export function distTasks (gulp) {

  const runSequence = require('run-sequence').use(gulp);

  gulpTasksCore(gulp);
  gulpTasksTest(gulp);
  gulpTasksLinters(gulp);

  const options = gulpOptionsBuilder();

  gulp.task('dist-preprocess', (callback) => {
    const argv = require('yargs').argv;
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
    const env = deepAssign({
      __DEV_MODE__: false,
      NODE_ENV: '"production"',
      'process.env.NODE_ENV': '"production"'
    }, options.env);

    const plugins = [
      new webpack.DefinePlugin(env),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ];

    const argv = require('yargs').argv;

    if (!argv.skipMinify) {
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }));
    }

    const config = deepAssign({
      plugins: plugins
    }, options.webpackConfig, options.webpack || {});

    if (!config.resolve) {
      config.resolve = {};
    }

    if (!config.resolveLoader) {
      config.resolveLoader = {};
    }

    if (options.webpack.module && options.webpack.module.loaders) {
      options.webpackConfig.module.loaders.forEach((loader) =>
        config.module.loaders.push(loader)
      );
    }

    config.resolve.extensions = deepAssign(config.resolve.extensions || [],
      ['', '.js', '.json', '.htm', '.html', '.scss', '.md', '.svg']);

    config.resolve.modulesDirectories = deepAssign(
      config.resolve.modulesDirectories || [],
      ['node_modules/grommet/node_modules', 'node_modules']
    );

    config.resolveLoader.modulesDirectories = deepAssign(
      config.resolveLoader.modulesDirectories || [],
      ['node_modules/grommet/node_modules', 'node_modules']
    );

    return gulp.src(options.mainJs)
      .pipe(gulpWebpack(config))
      .pipe(gulp.dest(options.dist));
  });
};

export default distTasks;
