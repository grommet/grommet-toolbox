import path from 'path';
import fs from 'fs';
import eslint from 'gulp-eslint';
import shelljs from 'shelljs';
import deepAssign from 'deep-assign';

import gulpOptionsBuilder from './gulp-options-builder';

export function linterTasks (gulp, opts) {

  const options = gulpOptionsBuilder(opts);

  let scssLintPath = path.resolve(process.cwd(), '.scss-lint.yml');
  try {
    fs.accessSync(scssLintPath, fs.F_OK);
  } catch (e) {
    scssLintPath = path.resolve(__dirname, '../.scss-lint.yml');
  }

  let esLintPath = path.resolve(process.cwd(), '.eslintrc');
  try {
    fs.accessSync(esLintPath, fs.F_OK);
  } catch (e) {
    esLintPath = path.resolve(__dirname, '../.eslintrc');
  }

  const customEslint = options.customEslintPath ?
    require(options.customEslintPath) : {};

  gulp.task('scsslint', () => {
    if (options.scsslint) {
      if (shelljs.which('scss-lint')) {
        var scsslint = require('gulp-scss-lint');
        return gulp.src(options.scssAssets || []).pipe(scsslint({
          'config': scssLintPath
        })).pipe(scsslint.failReporter());
      } else {
        console.error('[scsslint] scsslint skipped!');
        console.error(
          '[scsslint] scss-lint is not installed. Please install ruby and the ruby gem scss-lint.'
        );
      }
    }
    return false;
  });

  gulp.task('jslint', () => {
    const eslintRules = deepAssign({
      configFile: esLintPath
    }, customEslint);
    return gulp.src(options.jsAssets || [])
      .pipe(eslint(eslintRules))
      .pipe(eslint.formatEach())
      .pipe(eslint.failOnError());
  });
};

export default linterTasks;
