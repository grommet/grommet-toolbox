'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _unique = require('./utils/unique');

var _unique2 = _interopRequireDefault(_unique);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');

var argv = _yargs2.default.argv;

var options = (0, _gulpOptionsBuilder2.default)();

var env = (0, _deepAssign2.default)({
  __DEV_MODE__: false,
  NODE_ENV: '"production"',
  'process.env.NODE_ENV': '"production"'
}, options.env);

var config = _extends({}, options.webpack);

config.plugins = [new _webpack2.default.DefinePlugin(env), new _webpack2.default.optimize.OccurenceOrderPlugin()];

if (!argv.skipMinify) {
  config.plugins.push(new _webpack2.default.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

if (options.webpack.plugins) {
  options.webpack.plugins.forEach(function (plugin) {
    return config.plugins.push(plugin);
  });
}

config.resolve.extensions = (0, _unique2.default)(config.resolve.extensions, ['', '.react', '.jsx', '.js', '.json', '.htm', '.html', '.scss', '.md', '.svg']);

config.resolve.modulesDirectories = (0, _unique2.default)(config.resolve.modulesDirectories, ['node_modules/grommet/node_modules', 'node_modules']);

config.resolveLoader.modulesDirectories = (0, _unique2.default)(config.resolveLoader.modulesDirectories, ['node_modules/grommet/node_modules', 'node_modules']);

exports.default = config;

module.exports = config;