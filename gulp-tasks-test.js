import babel from 'gulp-babel';
import glob from 'glob';
import path from 'path';
import jsxCoverage from 'gulp-jsx-coverage';
import mocha from 'gulp-mocha';
import watch from 'gulp-watch';
import selenium from 'selenium-standalone';

import gulpOptionsBuilder from './gulp-options-builder';

export function testTasks (gulp) {

  const options = gulpOptionsBuilder();

  const jsxCoverageOptions = {
    src: options.testPaths || [],
    istanbul: {
      coverageVariable: '__MY_TEST_COVERAGE__',
      exclude: /node_modules|test|icons|lib|index/
    },
    coverage: {
      reporters: ['lcov'],
      directory: 'coverage'
    }
  };

  gulp.task('test', function(done) {
    if (options.testPaths) {
      const argv = require('yargs').argv;

      jsxCoverage.initModuleLoaderHack(jsxCoverageOptions);

      glob.sync('**src/js/**/*.js').forEach(function (file) {
        if (file.indexOf('lib') === -1 &&
          file.indexOf('icons') === -1) {
          require(path.resolve(file));
        }
      });

      gulp.src(options.testPaths, {
        read: false
      }).pipe(babel({
        "presets": [ "es2015", "react" ],
        "plugins": [
          "transform-object-rest-spread",
          "add-module-exports"
        ]
      })).pipe(mocha({
        reporter: 'spec'})).once('end', function() {
          if (argv.w) {
            const watchFolders = options.testPaths.slice();
            options.jsAssets.forEach((jsAsset) => watchFolders.push(jsAsset));
            watch(watchFolders, () => {
              gulp.src(options.testPaths, {
                read: false
              }).pipe(mocha({
                reporter: 'spec'
              })).once('end', () => console.log('Watching for changes...'))
              .on('error', (err) => {
                console.error('Test failed:', err.stack || err);
                if (argv.w) {
                  this.emit('end');
                } else {
                  process.exit(1);
                }
              });
            });
            console.log('Watching for changes...');
          } else {
            done();
          }
        }).on('error', (err) => {
          console.error('Test failed:', err.stack || err);
          if (argv.w) {
            this.emit('end');
          } else {
            process.exit(1);
          }
        }).on('end', jsxCoverage.collectIstanbulCoverage(jsxCoverageOptions))
        .on('end', () =>
          console.log(
            'Test coverage report available at coverage/lcov-report/index.html'
          )
        );
    } else {
      done();
    }
  });

  gulp.task('integration:clean', () => {
    if (selenium) {
      selenium.child.kill();
    }
  });

  gulp.task('selenium', (done) => {
    if (options.e2ePaths) {
      selenium.install({
        logger: function() {}
      }, (err) => {
        if (err) {
          return done(err);
        }

        selenium.start((err, child) => {
          if (err) {
            return done(err);
          }

          if (process.env.TRAVIS) {
            child.stderr.on('data', function(data) {
              console.log(data.toString());
            });
          }

          //saving the child to kill it later (oops)
          selenium.child = child;
          done();
        });
      });
    } else {
      console.log('You need options.e2ePaths to start the selenium server.');
    }
  });
};

export default testTasks;
