'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncTasks = syncTasks;

var _gulpRsync = require('gulp-rsync');

var _gulpRsync2 = _interopRequireDefault(_gulpRsync);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

var _gulpTasksCore = require('./gulp-tasks-core');

var _gulpTasksCore2 = _interopRequireDefault(_gulpTasksCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function syncTasks(gulp, opts) {

  var runSequence = require('run-sequence').use(gulp);

  (0, _gulpTasksCore2.default)(gulp);

  var options = (0, _gulpOptionsBuilder2.default)(opts);

  gulp.task('syncPre', function (callback) {
    return runSequence('dist', callback);
  });

  gulp.task('sync', ['syncPre'], function () {
    if (options.sync) {
      gulp.src(options.dist).pipe((0, _gulpRsync2.default)({
        root: options.dist,
        hostname: options.sync.hostname,
        username: options.sync.username,
        destination: options.sync.remoteDestination,
        recursive: true,
        relative: true,
        incremental: true,
        silent: true,
        clean: true,
        emptyDirectories: true,
        exclude: ['.DS_Store']
      }));
    }
  });
};

exports.default = syncTasks;