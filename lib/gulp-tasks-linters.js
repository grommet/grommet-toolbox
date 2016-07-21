'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linterTasks = linterTasks;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gulpEslint = require('gulp-eslint');

var _gulpEslint2 = _interopRequireDefault(_gulpEslint);

var _gulpCache = require('gulp-cache');

var _gulpCache2 = _interopRequireDefault(_gulpCache);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _gulpSassLint = require('gulp-sass-lint');

var _gulpSassLint2 = _interopRequireDefault(_gulpSassLint);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linterTasks(gulp, opts) {

  var options = (0, _gulpOptionsBuilder2.default)(opts);

  var scssLintPath = _path2.default.resolve(process.cwd(), '.sass-lint.yml');
  try {
    _fs2.default.accessSync(scssLintPath, _fs2.default.F_OK);
  } catch (e) {
    scssLintPath = _path2.default.resolve(__dirname, '../.sass-lint.yml');
  }

  var esLintPath = options.eslintConfigPath || _path2.default.resolve(process.cwd(), '.eslintrc');
  try {
    _fs2.default.accessSync(esLintPath, _fs2.default.F_OK);
  } catch (e) {
    esLintPath = _path2.default.resolve(__dirname, '../.eslintrc');
  }

  var eslintOverride = options.eslintOverride ? require(options.eslintOverride) : {};

  if (options.customEslintPath) {
    eslintOverride = require(options.customEslintPath);
    console.warn('customEslintPath has been deprecated. You should use eslintOverride instead');
  }

  gulp.task('scsslint', function () {
    if (options.scsslint) {
      return gulp.src(options.scssAssets || []).pipe((0, _gulpSassLint2.default)({
        configFile: scssLintPath
      })).pipe(_gulpSassLint2.default.format()).pipe(_gulpSassLint2.default.failOnError());
    }
    return false;
  });

  gulp.task('jslint', function () {
    var eslintRules = (0, _deepAssign2.default)({
      configFile: esLintPath
    }, eslintOverride);
    return gulp.src([].concat(options.jsAssets || []).concat(options.testPaths || [])).pipe((0, _gulpCache2.default)((0, _gulpEslint2.default)(eslintRules), {
      success: function success(linted) {
        return linted.eslint && !linted.eslint.messages.length;
      },
      value: function value(linted) {
        return { eslint: linted.eslint };
      }
    })).pipe(_gulpEslint2.default.formatEach()).pipe(_gulpEslint2.default.failAfterError()).on('error', function () {
      return process.exit(1);
    });
  });
};

exports.default = linterTasks;