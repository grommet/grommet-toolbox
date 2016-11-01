require('babel-register');

import webpack from 'webpack';
import deepAssign from 'deep-assign';
import unique from './utils/unique';

import gulpOptionsBuilder from './gulp-options-builder';
const options = gulpOptionsBuilder();

const env = deepAssign({
  __DEV_MODE__: false,
  NODE_ENV: '"production"',
  'process.env.NODE_ENV': '"production"'
}, options.env);

const config = {...options.webpack};

config.plugins = [
  new webpack.DefinePlugin(env),
  new webpack.optimize.OccurenceOrderPlugin()
];

if (options.argv.minify) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

if (options.webpack.plugins) {
  options.webpack.plugins.forEach((plugin) =>
    config.plugins.push(plugin)
  );
}

config.resolve.extensions = unique(
  config.resolve.extensions,
  ['', '.react', '.jsx', '.js', '.json', '.htm', '.html', '.scss', '.md', '.svg']
);

config.resolve.modulesDirectories = unique(
  config.resolve.modulesDirectories,
  ['node_modules/grommet/node_modules', 'node_modules']
);

config.resolveLoader.modulesDirectories = unique(
  config.resolveLoader.modulesDirectories,
  ['node_modules/grommet/node_modules', 'node_modules']
);

export default config;
module.exports = config;
