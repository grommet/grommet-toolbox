'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _unique = require('./utils/unique');

var _unique2 = _interopRequireDefault(_unique);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');

var options = (0, _gulpOptionsBuilder2.default)();

var env = (0, _deepAssign2.default)({}, options.env, {
  __DEV_MODE__: true,
  NODE_ENV: '"development"'
});

delete options.webpack.entry;
var config = (0, _deepAssign2.default)({
  entry: ['webpack-dev-server/client/index.js?http://' + (options.devServerHost || 'localhost') + ':' + (options.devServerPort || '8080'), 'webpack/hot/dev-server', './' + options.mainJs],

  output: {
    filename: 'index.js',
    path: options.dist,
    publicPath: '/'
  },

  devtool: 'eval'

}, options.webpack);

// Ensure dev loaders are used.
config.module.loaders = config.module.loaders.map(function (entry) {
  var loader = entry.loader;

  if (/babel/.test(loader)) {
    loader = loader.replace(/(babel)/, 'react-hot!$1');
  } else if (/sass/.test(loader)) {
    // returns style!css?sourceMap!sass?sourceMap&outputStyle...
    loader = loader.replace(/css!/, 'css?sourceMap!');
    loader = loader.replace(/css$/, 'css?sourceMap');
    loader = loader.replace(/(outputStyle)/, 'sourceMap&$1');
  }

  entry.loader = loader;
  return entry;
});

config.plugins = [new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.DefinePlugin(env)];

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