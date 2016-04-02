import gulpTasksLinters from './gulp-tasks-linters';
import gulpTasksTest from './gulp-tasks-test';
import gulpTasksDist from './gulp-tasks-dist';
import gulpTasksDev from './gulp-tasks-dev';
import gulpTasksSync from './gulp-tasks-sync';
import gulpTasksCore from './gulp-tasks-core';


export default function (gulp) {

  gulpTasksCore(gulp);
  gulpTasksLinters(gulp);
  gulpTasksTest(gulp);
  gulpTasksDist(gulp);
  gulpTasksDev(gulp);
  gulpTasksSync(gulp);

};
