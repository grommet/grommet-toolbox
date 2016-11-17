# grommet-toolbox

[![Dependency Status](https://david-dm.org/grommet/grommet-toolbox.svg)](https://david-dm.org/grommet/grommet-toolbox)  [![devDependency Status](https://david-dm.org/grommet/grommet-toolbox/dev-status.svg)](https://david-dm.org/grommet/grommet-toolbox#info=devDependencies)

Developer Environment for Grommet applications with the following built-in features:

* Ability to create a production ready distribution with minified JavaScript and CSS
* Ability to sync your distribution to a remote location
* JavaScript and Sass linters
* Development server with hot-reloading
* Test infrastructure based on tape and gulp watch
* Code coverage using Istanbul
* Convert raw svgs to Grommet icons with accessibility support
* Bundle your project and its dependencies in a compressed file

grommet-toolbox runs on top of Gulp.

### Install

```bash
npm install grommet-toolbox --save-dev
```

### Basic usage

**gulpfile.babel.js**
```javascript
import gulp from 'gulp';
import grommetToolbox from 'grommet-toolbox';

var opts = {
  copyAssets: [
    'src/index.html',
    {
      asset: 'src/img/**',
      dist: 'dist/img/'
    }
  ],
  scssAssets: ['src/scss/**/*.scss'],
  jsAssets: ['src/js/**/*.js'],
  mainJs: 'src/js/index.js',
  mainScss: 'src/scss/index.scss',
  devServerPort: 9000
};

grommetToolbox(gulp, opts);
```

Grommet-toolbox augments gulp object with these additional tasks:

* **gulp copy**: uses `copyAssets` option to move files to distribution folder.
* **gulp generate-icons**: uses `icons` option to convert raw svg icons to Grommet icons.
* **gulp scsslint**: uses `scssAssets` option to lint your Sass code.
* **gulp jslint**: uses `jsAssets` and `testPaths` options to lint your JavaScript code.
* **gulp dev**: starts a webpack dev server with hot reloading. See options for example configuration.
  * `--config`: Set the path of the config file to use.
  * `--no-preprocess`: Skips preprocess tasks.
  * `--no-open`: Skips opening dev server url in a browser.
* **gulp dist**: prepares your application/library for production.
  * `--config`: Set the path of the config file to use.
  * `--no-preprocess`: Skips preprocess tasks.
  * `--no-minify`: Skips minifying JS code.
* **gulp sync**: uses `sync` option to sync distribution content to a remote server.
* **gulp test**: uses `testPaths` option to execute tests based on Tape.
* **gulp test:watch**: runs tests and watch for changes to execute the tests again.
* **gulp test:coverage**: runs tests and generates a code coverage report.
* **gulp test:update**: runs all the tests and updates the Jest snapshots for the project.
* **gulp pack**: uses the package.json dependencies object to create a compressed file with all the dependencies included.

### Recommended Usage

As your configuration grows it gets really difficult to manipulate everything inside a single gulp file. Grommet-toolbox offers a config file where you can store your application specific settings. This is the **recommended** way of using this tool. Now you will have two files, **grommet-toolbox.config.js** and **gulpfile.babel.js**:

**grommet-toolbox.config.js**
```javascript
export default {
  copyAssets: [
    'src/index.html',
    {
      asset: 'src/img/**',
      dist: 'dist/img/'
    }
  ],
  scssAssets: ['src/scss/**/*.scss'],
  jsAssets: ['src/js/**/*.js'],
  mainJs: 'src/js/index.js',
  mainScss: 'src/scss/index.scss',
  devServerPort: 9000
};
```

**gulpfile.babel.js**
```javascript
import gulp from 'gulp';
import grommetToolbox from 'grommet-toolbox';

grommetToolbox(gulp);
```

grommet-toolbox will look into your application's root folder and extract the configuration for your project.

### Options

| property      | type          | description     | default      | example    |
| ------------- |---------------|-----------------|------------- |------------|
| argv          | object        | Optional. Default cli args set on gulp tasks. *See above.* | `{}` | `{open: false}` |
| base          | string        | Optional. Base working directory           | process.cwd()      | `base: '.'` |
| copyAssets    | array         | Optional. Assets to be copied to the distribution folder |  undefined  | [See copyAssets WIKI](https://github.com/grommet/grommet-toolbox/wiki/copyAssets-WIKI)  |
| eslintConfigPath | string     | Optional. Path to your custom eslint config file  | undefined          | `eslintConfigPath: path.resolve(__dirname, '../.eslintrc')`        |
| eslintOverride | string     | Optional. Path to your custom eslint overrides  | undefined          | `eslintOverride: path.resolve(__dirname, 'customEslintrc')`        |
| devPreprocess | array | Optional. A set of tasks to run before `gulp dev` | undefined | `['set-webpack-alias']` |
| devServerDisableHot | boolean | Optional. If true, will disable webpack hot reloading | false | `devServerDisableHot: true` |
| devServerHost | string | Optional. Host address for the webpack dev server | 'localhost' | `devServerHost: '127.0.0.1'` |
| devServerPort | int | Optional. Sets a listener port for the webpack dev server | 8080 | `devServerPort: 9000` |
| devServerProxy | object | Optional. Proxy requests from the webpack dev server | undefined | `devServerProxy: { '/rest/*': 'http://localhost:8114' }`|
| devServer | object | Optional. Any additional options for the webpack dev server | undefined | `devServer: { https: true }`|
| dist | string | Optional. Location of the distribution folder | 'dist' | `dist: 'distribution'` |
| distPreprocess | array | Optional. A set of tasks to run before `gulp dist` | undefined | `['dist-css']` |
| env | object | Optional. Adds environment variables for Node | undefined | `{ DEV_MODE: 'true'}` |
| icons | object | Optional. Converts raw icons to a Grommet icon | undefined | [See icon WIKI](https://github.com/grommet/grommet-toolbox/wiki/icon-WIKI) |
| jsAssets | array | Required. Location of your JavaScript Assets | [] | `jsAssets: ['src/js/**/*.js']` |
| jsLoader | object | Optional. If you want to use another webpack loader for your JavaScript Assets | react-loader | `{ test: /\.jsx?$/, loader: 'babel-loader', exclude: /(node_modules|bower_components|src\/lib)/ }` |
| lintCache |  boolean | Optional. If true, it will skip caching for linters (build time increases). | true | `lintCache: false` |
| mainJs |  string | Required. Location of your main JavaScript file | undefined | `mainJs: 'src/js/index.js'` |
| preCommitTasks | array | Optional.  The gulp tasks to run as git pre-commit hooks | jslint, scsslint, test | `['jslint','scsslint','test']` |
| publicPath | string | Optional. Your main app context | '/' | `publichPath: '/docs'` |
| scssAssets | array | Optional. Location of your Sass Assets | [] | `scssAssets: ['src/scss/**/*.scss']` |
| scssLoader | object | Optional. If you want to use another webpack loader for your SCSS Assets | react-loader | `{ test: /\.scss?$/, loader: 'file?name=assets/css/[name].css!sass'}` |
| scsslint | boolean | (deprecated) Optional. If false, it will skip Sass linting | true | `scsslint: false` |
| sync | object | Optional. Syncs your content to a remote server | undefined | `sync: { hostname: 'grommet.io', username: 'grommet', remoteDestination: '/var/www/html/'}` |
| testPaths | array | Optional. Location of your test assets | undefined | `testPaths: ['test/**/*.js']` |
| webpack | object | Optional. Additional webpack options to be used in gulp dist | undefined | [See Webpack Configuration](https://webpack.github.io/docs/configuration.html) |
| webpackProfile | string | Optional. Location to save webpack profile stats in json format. | undefined | `webpackProfile: './stats.json'` |

### Example

[See grommet-todo](https://github.com/grommet/grommet-todo)

### Advanced

[See Advanced Usage wiki](https://github.com/grommet/grommet-toolbox/wiki/Advanced-Usage)
