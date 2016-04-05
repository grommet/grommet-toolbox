require('babel-register');

import webpack from 'webpack';
import deepAssign from 'deep-assign';
import yargs from 'yargs';
const argv = yargs.argv;

import gulpOptionsBuilder from './gulp-options-builder';
const options = gulpOptionsBuilder();

const env = deepAssign({
  __DEV_MODE__: false,
  NODE_ENV: '"production"',
  'process.env.NODE_ENV': '"production"'
}, options.env);

const plugins = [
  new webpack.DefinePlugin(env),
  new webpack.optimize.OccurenceOrderPlugin()
  //new webpack.optimize.DedupePlugin()
];

if (!argv.skipMinify) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

const config = deepAssign({
  plugins: plugins
}, options.webpackConfig, options.webpack || {});

if (!config.resolve) {
  config.resolve = {};
}

if (!config.resolveLoader) {
  config.resolveLoader = {};
}

if (options.webpack.module && options.webpack.module.loaders) {
  options.webpackConfig.module.loaders.forEach((loader) =>
    config.module.loaders.push(loader)
  );
}

config.resolve.extensions = deepAssign(config.resolve.extensions || [],
  ['', '.js', '.json', '.htm', '.html', '.scss', '.md', '.svg']);

config.resolve.modulesDirectories = deepAssign(
  config.resolve.modulesDirectories || [],
  ['node_modules/grommet/node_modules', 'node_modules']
);

config.resolveLoader.modulesDirectories = deepAssign(
  config.resolveLoader.modulesDirectories || [],
  ['node_modules/grommet/node_modules', 'node_modules']
);

export default config;
module.exports = config;
