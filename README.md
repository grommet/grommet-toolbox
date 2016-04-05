# grommet-toolbox

Developer Environment for Grommet applications with the following buit-in features:

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
