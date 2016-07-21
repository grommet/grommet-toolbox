'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coreTasks = coreTasks;

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _gulpFile = require('gulp-file');

var _gulpFile2 = _interopRequireDefault(_gulpFile);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpCache = require('gulp-cache');

var _gulpCache2 = _interopRequireDefault(_gulpCache);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _grommetIconLoader = require('grommet-icon-loader');

var _grommetIconLoader2 = _interopRequireDefault(_grommetIconLoader);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _pathIsAbsolute = require('path-is-absolute');

var _pathIsAbsolute2 = _interopRequireDefault(_pathIsAbsolute);

var _gulpOptionsBuilder = require('./gulp-options-builder');

var _gulpOptionsBuilder2 = _interopRequireDefault(_gulpOptionsBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loaded = void 0;
function coreTasks(gulp, opts) {
  if (!loaded) {
    (function () {
      var runSequence = require('run-sequence').use(gulp);

      gulp.task('copy', function (done) {
        var count = 0;
        (options.copyAssets || []).forEach(function (copyAsset) {
          if (copyAsset.filename) {
            count++;
            gulp.src('./').pipe((0, _gulpFile2.default)(copyAsset.filename, copyAsset.asset)).pipe(gulp.dest(copyAsset.dist ? copyAsset.dist : options.dist));
          } else {
            (function () {
              var asset = copyAsset.asset ? copyAsset.asset : copyAsset;
              var assets = [asset];
              if (copyAsset.ignores) {
                copyAsset.ignores.forEach(function (ignore) {
                  assets.push('!' + asset.replace('**', '') + ignore + '/**');
                  assets.push('!' + asset + ignore);
                  assets.push('!' + asset + '**/' + ignore);
                  assets.push('!' + asset + '**/' + ignore + '/**');
                });
              }

              var babelrcPath = _path2.default.resolve(process.cwd(), '.babelrc');
              try {
                _fs2.default.accessSync(babelrcPath, _fs2.default.F_OK);
              } catch (e) {
                babelrcPath = _path2.default.resolve(__dirname, '../.babelrc');
              }

              var babelConfig = JSON.parse(_fs2.default.readFileSync(babelrcPath));

              gulp.src(assets, {
                dot: true
              }).pipe((0, _gulpIf2.default)(copyAsset.babel, (0, _gulpBabel2.default)(babelConfig))).pipe(gulp.dest(copyAsset.dist ? copyAsset.dist : options.dist)).on('end', function () {
                count++;
                if (count === options.copyAssets.length) {
                  done();
                }
              });
            })();
          }
        });
      });

      gulp.task('generate-icons', function (done) {
        var basePath = options.base || process.cwd();
        var iconsConfig = options.icons || {};
        var iconInputFolder = iconsConfig.source;
        if (iconInputFolder) {
          if (!(0, _pathIsAbsolute2.default)(iconsConfig.source)) {
            iconInputFolder = _path2.default.resolve(basePath, iconsConfig.source || 'src/img/icons');
          }

          _fs2.default.readdir(iconInputFolder, function (err, icons) {
            if (icons) {
              if (iconsConfig.destination) {
                icons.forEach(function (icon, index) {
                  if (/\.svg$/.test(icon)) {
                    var iconPath = _path2.default.join(iconInputFolder, icon);
                    var content = _fs2.default.readFileSync(iconPath, 'utf8');
                    var query = options.icons.context ? '?context=' + options.icons.context : '?context=grommet/';
                    query += '&copyright=(C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP';
                    var loaderContext = {
                      query: query,
                      resourcePath: iconPath,
                      addDependency: function addDependency() {},
                      async: function async() {
                        return function (err, result) {
                          var iconDestFolder = iconsConfig.destination;
                          if (!(0, _pathIsAbsolute2.default)(iconsConfig.destination)) {
                            iconDestFolder = _path2.default.resolve(basePath, iconsConfig.destination);
                          }

                          _del2.default.sync([iconDestFolder]);

                          (0, _mkdirp2.default)(iconDestFolder, function (err) {

                            if (err) {
                              throw err;
                            }

                            var componentName = icon.replace('.svg', '.js');
                            componentName = componentName.replace(/^(.)|-([a-z])/g, function (g) {
                              return g.length > 1 ? g[1].toUpperCase() : g.toUpperCase();
                            });

                            var destinationFile = _path2.default.resolve(iconDestFolder, componentName);

                            _fs2.default.writeFile(destinationFile, result, function (err) {
                              if (err) {
                                throw err;
                              }

                              if (index === icons.length - 1) {
                                done();
                              }
                            });
                          });
                        };
                      }
                    };
                    _grommetIconLoader2.default.apply(loaderContext, [content]);
                  }
                });
              } else {
                console.log('Please specify the options.icons.destination property in your gulpfile.');
              }
            } else {
              done();
            }
          });
        } else {
          done();
        }
      });

      gulp.task('preprocess', function (callback) {
        return runSequence('clean', 'generate-icons', 'jslint', 'scsslint', callback);
      });

      gulp.task('clean', function () {
        return _del2.default.sync([options.dist]);
      });

      gulp.task('clear-cache', function (done) {
        return _gulpCache2.default.clearAll(done);
      });

      gulp.task('node-clean', function (done) {
        require('rimraf')(_path2.default.resolve(process.cwd(), 'node_modules'), function (err) {
          if (err) {
            throw err;
          }
          done();
        });
      });

      loaded = true;
    })();
  }

  var options = (0, _gulpOptionsBuilder2.default)(opts);

  if (options.base) {
    process.chdir(options.base);
  }
}

exports.default = coreTasks;