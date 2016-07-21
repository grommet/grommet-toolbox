'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptions = getOptions;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = void 0;
function getOptions(opts) {
  if (!options) {
    if (!opts) {
      var configPath = _path2.default.resolve(process.cwd(), 'grommet-toolbox.config.js');
      try {
        _fs2.default.accessSync(configPath, _fs2.default.F_OK);
      } catch (e) {
        opts = {};
      }

      if (!opts) {
        var config = require(configPath);
        opts = config.default || config;
      }
    }

    options = opts || {};

    options.scsslint = options.scsslint === undefined ? true : options.scsslint;

    options.dist = options.dist || _path2.default.resolve(process.cwd(), 'dist');

    var jsLoader = options.jsLoader || {
      test: /\.jsx?|.react$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components|src\/lib)/
    };

    var scssLoader = options.scssLoader || {
      test: /\.scss$/,
      loader: 'style!css!sass?outputStyle=compressed&' + 'includePaths[]=' + encodeURIComponent(_path2.default.resolve(options.base || process.cwd(), './node_modules')) + '&includePaths[]=' + encodeURIComponent(_path2.default.resolve(options.base || process.cwd(), './node_modules/grommet/node_modules'))
    };

    options.webpack = (0, _deepAssign2.default)({
      entry: options.webpack && options.webpack.entry ? options.webpack.entry : _path2.default.resolve(options.mainJs),
      output: {
        filename: 'index.js'
      },
      resolve: {
        root: [_path2.default.resolve(process.cwd(), 'node_modules')]
      },
      module: {
        loaders: []
      },
      resolveLoader: {}
    }, options.webpack);

    options.webpack.module.loaders = options.webpack.module.loaders.concat(jsLoader, scssLoader, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.png$/,
      loader: 'file-loader?mimetype=image/png'
    }, {
      test: /\.jpg$/,
      loader: 'file-loader?mimetype=image/jpg'
    }, {
      test: /\.woff$/,
      loader: 'file-loader?mimetype=application/font-woff'
    }, {
      test: /\.otf$/,
      loader: 'file-loader?mimetype=application/font/opentype'
    });
  }

  return options;
};

exports.default = getOptions;