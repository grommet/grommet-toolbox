'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulpTasksPack = require('./gulp-tasks-pack');

Object.keys(_gulpTasksPack).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksPack[key];
    }
  });
});

var _gulpTasksDev = require('./gulp-tasks-dev');

Object.keys(_gulpTasksDev).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksDev[key];
    }
  });
});

var _gulpTasksDist = require('./gulp-tasks-dist');

Object.keys(_gulpTasksDist).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksDist[key];
    }
  });
});

var _gulpTasksLinters = require('./gulp-tasks-linters');

Object.keys(_gulpTasksLinters).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksLinters[key];
    }
  });
});

var _gulpTasksSync = require('./gulp-tasks-sync');

Object.keys(_gulpTasksSync).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksSync[key];
    }
  });
});

var _gulpTasksTest = require('./gulp-tasks-test');

Object.keys(_gulpTasksTest).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksTest[key];
    }
  });
});

var _gulpTasksCore = require('./gulp-tasks-core');

Object.keys(_gulpTasksCore).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpTasksCore[key];
    }
  });
});

var _gulpOptionsBuilder = require('./gulp-options-builder');

Object.keys(_gulpOptionsBuilder).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gulpOptionsBuilder[key];
    }
  });
});

var _gulpTasks = require('./gulp-tasks');

var _gulpTasks2 = _interopRequireDefault(_gulpTasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _gulpTasks2.default;