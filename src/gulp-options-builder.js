import path from 'path';
import fs from 'fs';
import deepAssign from 'deep-assign';

let options;
export function getOptions (opts) {
  if (!options) {
    if (!opts) {
      const configPath = path.resolve(process.cwd(), 'grommet-toolbox.config.js');
      try {
        fs.accessSync(configPath, fs.F_OK);
      } catch (e) {
        opts = {};
      }

      if (!opts) {
        const config = require(configPath);
        opts = config.default || config;
      }
    }

    options = opts || {};

    options.scsslint = options.scsslint === undefined ? true : options.scsslint;

    options.dist = options.dist || path.resolve(process.cwd(), 'dist');

    const jsLoader = options.jsLoader || {
      test: /\.jsx?$/,
      loader: 'react-hot!babel-loader',
      exclude: /(node_modules|bower_components|src\/lib)/
    };

    const scssLoader = options.scssLoader || {
      test: /\.scss$/,
      loader: 'style!css!sass?outputStyle=expanded&' +
        'includePaths[]=' +
        (encodeURIComponent(
          path.resolve(options.base || process.cwd(), './node_modules')
        )) +
        '&includePaths[]=' +
        (encodeURIComponent(
          path.resolve(options.base || process.cwd(),
          './node_modules/grommet/node_modules'))
        )
    };

    options.webpack = deepAssign({
      entry: options.webpack && options.webpack.entry ?
        options.webpack.entry : path.resolve(options.mainJs),
      output: {
        filename: 'index.js'
      },
      resolve: {
        root: [
          path.resolve(process.cwd(), 'node_modules')
        ]
      },
      module: {
        loaders: []
      },
      resolveLoader: {}
    }, options.webpack);

    options.webpack.module.loaders = options.webpack.module.loaders.concat(
      jsLoader,
      scssLoader,
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader?mimetype=image/png'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader?mimetype=image/jpg'
      },
      {
        test: /\.woff$/,
        loader: 'file-loader?mimetype=application/font-woff'
      },
      {
        test: /\.otf$/,
        loader: 'file-loader?mimetype=application/font/opentype'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    );
  }

  return options;
};

export default getOptions;
