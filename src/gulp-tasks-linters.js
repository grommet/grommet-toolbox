import path from 'path';
import fs from 'fs';
import eslint from 'gulp-eslint';
import cache from 'gulp-cache';
import deepAssign from 'deep-assign';
import sassLint from 'gulp-sass-lint';

import gulpOptionsBuilder from './gulp-options-builder';

export function linterTasks (gulp, opts) {

  const options = gulpOptionsBuilder(opts);

  let scssLintPath = path.resolve(process.cwd(), '.sass-lint.yml');
  try {
    fs.accessSync(scssLintPath, fs.F_OK);
  } catch (e) {
    scssLintPath = path.resolve(__dirname, '../.sass-lint.yml');
  }

  let esLintPath = options.eslintConfigPath || path.resolve(process.cwd(), '.eslintrc');
  try {
    fs.accessSync(esLintPath, fs.F_OK);
  } catch (e) {
    esLintPath = path.resolve(__dirname, '../.eslintrc');
  }

  let eslintOverride = options.eslintOverride ?
    require(options.eslintOverride) : {};

  if (options.customEslintPath) {
    eslintOverride = require(options.customEslintPath);
    console.warn('customEslintPath has been deprecated. You should use eslintOverride instead');
  }

  gulp.task('scsslint', () => {
    if (options.scsslint) {
      return gulp.src(options.scssAssets || [])
        .pipe(sassLint({
          configFile: scssLintPath
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
    }
    return false;
  });

  gulp.task('jslint', () => {
    const eslintRules = deepAssign({
      configFile: esLintPath
    }, eslintOverride);

    let jslintPipe = eslint(eslintRules);

    if (options.lintCache) {
      const eslintRuleSet = fs.readFileSync(eslintRules.configFile, 'utf8');

      jslintPipe = cache(jslintPipe, {
        key: (file) => eslintRuleSet + file.contents.toString('utf8'),
        success: (linted) => linted.eslint && !linted.eslint.messages.length,
        value: (linted) => ({eslint: linted.eslint})
      });
    } else {
      console.warn('Lint cache is currently disabled');
    }

    return gulp.src([].concat(options.jsAssets || []).concat(options.testPaths || []))
      .pipe(jslintPipe)
      .pipe(eslint.formatEach())
      .pipe(eslint.failAfterError())
      .on('error', () => process.exit(1));
  });
};

export default linterTasks;
