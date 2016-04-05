import del from 'del';
import file from 'gulp-file';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import path from 'path';
import fs from 'fs';
import loader from 'grommet-icon-loader';
import mkdirp from 'mkdirp';
import pathIsAbsolute from 'path-is-absolute';

import gulpOptionsBuilder from './gulp-options-builder';

let loaded;
export function coreTasks (gulp, opts) {
  if (!loaded) {
    const runSequence = require('run-sequence').use(gulp);

    gulp.task('copy', () => {
      (options.copyAssets || []).forEach((copyAsset) => {
        if (copyAsset.filename) {
          gulp.src('./')
            .pipe(file(copyAsset.filename, copyAsset.asset))
            .pipe(gulp.dest(copyAsset.dist ? copyAsset.dist : options.dist));
        } else {
          var asset = copyAsset.asset ? copyAsset.asset : copyAsset;
          var assets = [asset];
          if (copyAsset.ignores) {
            copyAsset.ignores.forEach(function(ignore) {
              assets.push('!' + asset + ignore);
              assets.push('!' + asset + '**/' + ignore);
              assets.push('!' + asset + '**/' + ignore + '/**');
            });
          }

          let babelrcPath = path.resolve(process.cwd(), '.babelrc');
          if (!fs.statSync(babelrcPath)) {
            babelrcPath = path.resolve(__dirname, '.babelrc');
          }

          const babelConfig = JSON.parse(fs.readFileSync(babelrcPath));

          gulp.src(assets, {
            dot: true
          }).pipe(gulpif(copyAsset.babel, babel(babelConfig)))
          .pipe(gulp.dest(copyAsset.dist ? copyAsset.dist : options.dist));
        }

      });
    });

    gulp.task('generate-icons', (done) => {
      var basePath = options.base || process.cwd();
      var iconsConfig = options.icons || {};
      var iconInputFolder = iconsConfig.source;
      if (iconInputFolder) {
        if (!pathIsAbsolute(iconsConfig.source)) {
          iconInputFolder = path.resolve(
            basePath, iconsConfig.source || 'src/img/icons'
          );
        }

        fs.readdir(iconInputFolder, function(err, icons) {
          if (icons) {
            if (iconsConfig.destination) {

              icons.forEach(function (icon, index) {

                if (/\.svg$/.test(icon)) {
                  var iconPath = path.join(iconInputFolder, icon);
                  var content = fs.readFileSync(iconPath, 'utf8');
                  var query = options.icons.context ?
                    `?context=${options.icons.context}` : '?context=grommet/';
                  query += (
                    '&copyright=(C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP'
                  );
                  var loaderContext = {
                    query: query,
                    resourcePath: iconPath,
                    addDependency: function () {},
                    async: function() {
                      return function(err, result) {
                        var iconDestFolder = iconsConfig.destination;
                        if (!pathIsAbsolute(iconsConfig.destination)) {
                          iconDestFolder = path.resolve(
                            basePath, iconsConfig.destination
                          );
                        }

                        del.sync([iconDestFolder]);

                        mkdirp(iconDestFolder, function(err) {

                          if (err) {
                            throw err;
                          }

                          var componentName = icon.replace('.svg', '.js');
                          componentName = componentName.replace(/^(.)|-([a-z])/g,
                            (g) => {
                              return g.length > 1 ?
                                g[1].toUpperCase() : g.toUpperCase();
                            }
                          );

                          var destinationFile = path.resolve(
                            iconDestFolder, componentName
                          );

                          fs.writeFile(destinationFile, result, function(err) {
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
                  loader.apply(loaderContext, [content]);
                }
              });
            } else {
              console.log(
                'Please specify the options.icons.destination property in your gulpfile.'
              );
            }
          } else {
            done();
          }
        });
      } else {
        done();
      }
    });

    gulp.task('preprocess', (callback) =>
      runSequence(
        'clean', 'copy', 'generate-icons', 'jslint', 'scsslint', callback
      )
    );

    gulp.task('clean', () => del.sync([options.dist]));

    gulp.task('node-clean', (done) => {
      require('rimraf')(path.resolve(process.cwd(), 'node_modules'), (err) => {
        if (err) {
          throw err;
        }
        done();
      });
    });

    loaded = true;
  }

  const options = gulpOptionsBuilder(opts);

  if (options.base) {
    process.chdir(options.base);
  }
}

export default coreTasks;
