import gulpTasksLinters from './gulp-tasks-linters';
import gulpTasksTest from './gulp-tasks-test';
import gulpTasksDist from './gulp-tasks-dist';
import gulpTasksDev from './gulp-tasks-dev';
import gulpTasksSync from './gulp-tasks-sync';
import gulpTasksCore from './gulp-tasks-core';

export default function (gulp, options) {

  gulpTasksCore(gulp, options);
  gulpTasksLinters(gulp, options);
  gulpTasksTest(gulp, options);
  gulpTasksDist(gulp, options);
  gulpTasksDev(gulp, options);
  gulpTasksSync(gulp, options);

};
