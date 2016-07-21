'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distTasks = distTasks;

var _webpackStream = require('webpack-stream');

var _webpackStream2 = _interopRequireDefault(_webpackStream);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

var _gulpTasksCore = require('./gulp-tasks-core');

var _gulpTasksCore2 = _interopRequireDefault(_gulpTasksCore);

var _gulpTasksTest = require('./gulp-tasks-test');

var _gulpTasksTest2 = _interopRequireDefault(_gulpTasksTest);

var _gulpTasksLinters = require('./gulp-tasks-linters');

var _gulpTasksLinters2 = _interopRequireDefault(_gulpTasksLinters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _yargs2.default.argv;

function distTasks(gulp, opts) {

  var runSequence = require('run-sequence').use(gulp);

  (0, _gulpTasksCore2.default)(gulp, opts);
  (0, _gulpTasksTest2.default)(gulp, opts);
  (0, _gulpTasksLinters2.default)(gulp, opts);

  var options = (0, _gulpOptionsBuilder2.default)(opts);

  gulp.task('dist-preprocess', function (callback) {
    if (argv.skipPreprocess) {
      callback();
    } else if (options.distPreprocess) {
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

  gulp.task('dist', ['dist-preprocess'], function () {

    var webpackConfigPath = _path2.default.resolve(__dirname, 'webpack.dist.config.js');

    if (argv.config) {
      webpackConfigPath = _path2.default.resolve(argv.config);
    }

    var config = require(webpackConfigPath);

    return gulp.src(options.mainJs).pipe((0, _webpackStream2.default)(config)).pipe(gulp.dest(options.dist));
  });
};

exports.default = distTasks;