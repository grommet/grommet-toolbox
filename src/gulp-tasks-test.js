import env from 'gulp-env';
import istanbul from 'gulp-babel-istanbul';
import tape from 'gulp-tape';
import gulpif from 'gulp-if';
import tapSpec from 'tap-spec';

import gulpOptionsBuilder from './gulp-options-builder';

const envs = env.set({
  NODE_ENV: 'test'
});

export function testTasks (gulp, opts) {

  const runSequence = require('run-sequence').use(gulp);

  const options = gulpOptionsBuilder(opts);

  let watch;

  gulp.task('test', () => {
    if (watch) {
      process.env.NODE_ENV = 'test';
    }
    if (options.testPaths) {
      return gulp.src(options.testPaths)
        .pipe(gulpif(!watch, envs))
        .pipe(tape({
          reporter: tapSpec()
        }))
        .pipe(gulpif(!watch, envs.reset));
    }
  });

  gulp.task('test:watcher', () =>
    gulp.watch([...options.testPaths, ...options.jsAssets], ['test'])
  );

  gulp.task('test:watch', () => {
    watch = true;
    runSequence('test', 'test:watcher');
  });

  gulp.task('test:coverage', (done) => {
    if (options.testPaths) {
      gulp.src(options.jsAssets)
        .pipe(istanbul({
          instrumenter: require('isparta').Instrumenter,
          includeUntested: true
        }))
        .pipe(istanbul.hookRequire()).on('finish', () => {
          gulp.src(options.testPaths)
            .pipe(envs)
            .pipe(tape({
              reporter: tapSpec()
            }))
            .pipe(envs.reset)
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
