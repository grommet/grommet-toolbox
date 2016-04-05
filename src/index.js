import gulpTasks from './gulp-tasks';
import gulpOptionsBuilder from './gulp-options-builder';

export * from './gulp-tasks-dev';
export * from './gulp-tasks-dist';
export * from './gulp-tasks-linters';
export * from './gulp-tasks-sync';
export * from './gulp-tasks-test';
export * from './gulp-tasks-core';

export const options = gulpOptionsBuilder();

export default gulpTasks;
