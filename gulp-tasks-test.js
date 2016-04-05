import istanbul from 'gulp-babel-istanbul';
import tape from 'gulp-tape';
import tapSpec from 'tap-spec';

import gulpOptionsBuilder from './gulp-options-builder';

export function testTasks (gulp, opts) {

  const runSequence = require('run-sequence').use(gulp);

  const options = gulpOptionsBuilder(opts);

  gulp.task('test', () => {
    if (options.testPaths) {
      return gulp.src(options.testPaths)
        .pipe(tape({
          reporter: tapSpec()
        }));
    }
  });

  gulp.task('test:watcher', () =>
    gulp.watch([...options.testPaths, ...options.jsAssets], ['test'])
  );

  gulp.task('test:watch', () =>
    runSequence('test', 'test:watcher')
  );

  gulp.task('test:coverage', (done) => {
    if (options.testPaths) {
      gulp.src(options.jsAssets)
        .pipe(istanbul({
          instrumenter: require('isparta').Instrumenter,
          includeUntested: true
        }))
        .pipe(istanbul.hookRequire()).on('finish', () => {
          gulp.src(options.testPaths)
            .pipe(tape({
              reporter: tapSpec()
            }))
            .pipe(istanbul.writeReports({
              dir: './coverage',
              reporters: ['lcov']
            })).on('end', () => {
              console.log('Test coverage report available at coverage/lcov-report/index.html');
              done();
            });
        });
    } else {
      done();
    }
  });
};

export default testTasks;
