require('babel-register');

import webpack from 'webpack';
import deepAssign from 'deep-assign';
import unique from './utils/unique';

import gulpOptionsBuilder from './gulp-options-builder';
const options = gulpOptionsBuilder();

const env = deepAssign({}, options.env, {
  __DEV_MODE__: true,
  NODE_ENV: '"development"'
});

delete options.webpack.entry;
const protocol = (options.devServer && options.devServer.https) ? 'https' : 'http';
const config = deepAssign({
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client/index.js?' + protocol + '://' + (options.devServerHost || 'localhost') + ':' + (options.devServerPort || '8080'),
    'webpack/hot/dev-server',
    './' + options.mainJs
  ],

  output: {
    filename: 'index.js',
    path: options.dist,
    publicPath: '/'
  },

  devtool: 'eval-source-map'

}, options.webpack);

// Ensure dev loaders are used.
config.module.loaders = config.module.loaders.map(entry => {
  let {loader} = entry;
  if (/sass/.test(loader)) {
    // returns style!css?sourceMap!sass?sourceMap&outputStyle...
    loader = loader.replace(/css!/, 'css?sourceMap!');
    loader = loader.replace(/css$/, 'css?sourceMap');
    loader = loader.replace(/(outputStyle)/, 'sourceMap&$1');
  }

  entry.loader = loader;
  return entry;
});

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin(env)
];

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
