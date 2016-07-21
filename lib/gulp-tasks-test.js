'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testTasks = testTasks;

var _gulpEnv = require('gulp-env');

var _gulpEnv2 = _interopRequireDefault(_gulpEnv);

var _gulpBabelIstanbul = require('gulp-babel-istanbul');

var _gulpBabelIstanbul2 = _interopRequireDefault(_gulpBabelIstanbul);

var _gulpTape = require('gulp-tape');

var _gulpTape2 = _interopRequireDefault(_gulpTape);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _tapSpec = require('tap-spec');

var _tapSpec2 = _interopRequireDefault(_tapSpec);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function testTasks(gulp, opts) {

  var envs = _gulpEnv2.default.set({
    NODE_ENV: 'test'
  });

  var runSequence = require('run-sequence').use(gulp);

  var options = (0, _gulpOptionsBuilder2.default)(opts);

  var watch = void 0;

  gulp.task('test', function () {
    if (watch) {
      process.env.NODE_ENV = 'test';
    }
    if (options.testPaths) {
      return gulp.src(options.testPaths).pipe((0, _gulpIf2.default)(!watch, envs)).pipe((0, _gulpTape2.default)({
        reporter: (0, _tapSpec2.default)(),
        bail: true
      })).on('error', function (error) {
        _gulpUtil2.default.log(error.message);
        process.exit(1);
      }).pipe((0, _gulpIf2.default)(!watch, envs.reset));
    }
  });

  gulp.task('test:watcher', function () {
    return gulp.watch([].concat(_toConsumableArray(options.testPaths), _toConsumableArray(options.jsAssets)), ['test']);
  });

  gulp.task('test:watch', function () {
    watch = true;
    runSequence('test', 'test:watcher');
  });

  gulp.task('test:coverage', function (done) {
    if (options.testPaths) {
      gulp.src(options.jsAssets).pipe((0, _gulpBabelIstanbul2.default)({
        instrumenter: require('isparta').Instrumenter,
        includeUntested: true
      })).pipe(_gulpBabelIstanbul2.default.hookRequire()).on('finish', function () {
        gulp.src(options.testPaths).pipe(envs).pipe((0, _gulpTape2.default)({
          reporter: (0, _tapSpec2.default)(),
          bail: true
        })).on('error', function (error) {
          _gulpUtil2.default.log(error.message);
          process.exit(1);
        }).pipe(envs.reset).pipe(_gulpBabelIstanbul2.default.writeReports({
          dir: './coverage',
          reporters: ['lcov']
        })).on('end', function () {
          console.log('Test coverage report available at coverage/lcov-report/index.html');
          done();
        });
      });
    } else {
      done();
    }
  });
};

exports.default = testTasks;