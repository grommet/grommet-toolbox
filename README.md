# grommet-toolbox

Developer Environment for Grommet applications with the following built-in features:

* Ability to create a production ready distribution with minified Javascript and CSS
* Ability to sync your distribution to a remote location
* Javascript and Sass linters
* Development server with hot-reloading
* Test infrastructure based on tape and gulp watch
* Code coverage using Istanbul

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
  devServerPort: 9000,
  scsslint: true
};

grommetToolbox(gulp, opts);
```

### Options

| property      | type          | description     | default      | example    |
| ------------- |---------------|-----------------|------------- |------------|
| base          | string        | Optional. Base working directory           | process.cwd()      | `base: '.'` |
| copyAssets    | array         | Optional. Assets to be copied to the distribution folder |  undefined  | [See copyAssets WIKI](https://github.com/grommet/grommet-toolbox/wiki/copyAssets-WIKI)  |
| customEslintPath | string     | Optional. Path to your custom eslint overrides  | undefined          | `customEslintPath: path.resolve(__dirname, 'customEslintrc')`        |
| devPreprocess | array | Optional. A set of tasks to run before `gulp dev` | undefined | `['set-webpack-alias']` |
| devServerDisableHot | boolean | Optional. If true, will disable webpack hot reloading | false | devServerDisableHot: true |
| devServerHost | string | Optional. Host address for the webpack dev server | 'localhost' | devServerHost: '127.0.0.1 |
| devServerPort | int | Optional. Sets a listener port for the webpack dev server | 8080 | devServerPort: 9000 |

More to be added.
