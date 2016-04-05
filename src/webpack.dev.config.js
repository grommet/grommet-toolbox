import webpack from 'webpack';
import deepAssign from 'deep-assign';

import gulpOptionsBuilder from './gulp-options-builder';
const options = gulpOptionsBuilder();
delete options.webpackConfig.entry;

const env = deepAssign({}, options.env, {
  __DEV_MODE__: true,
  NODE_ENV: '"development"'
});

const config = deepAssign({}, options.webpackConfig, {
  entry: {
    app: [
      'webpack-dev-server/client?http://' + (options.devServerHost || 'localhost')  + ':' + (options.devServerPort || '8080'),
      'webpack/hot/only-dev-server',
      './' + options.mainJs
    ]
  },

  output: {
    filename: 'index.js',
    path: options.dist,
    publicPath: '/'
  },

  devtool: 'eval'

}, options.webpack || {});

if (!config.resolve) {
  config.resolve = {};
}

if (!config.resolveLoader) {
  config.resolveLoader = {};
}

if (options.webpack.module && options.webpack.module.loaders) {
  options.webpack.module.loaders.forEach((loader) =>
    config.module.loaders.push(loader)
  );
}

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin(env)
];

if (options.webpack.plugins) {
  options.webpack.plugins.forEach((plugin) =>
    config.plugins.push(plugin)
  );
}

config.resolve.extensions = deepAssign(
  config.resolve.extensions || [],
  ['', '.js', '.json', '.htm', '.html', '.scss', '.md', '.svg']
);

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
