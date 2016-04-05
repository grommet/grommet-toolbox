import rsync from 'gulp-rsync';

import gulpOptionsBuilder from './gulp-options-builder';
import gulpTasksCore from './gulp-tasks-core';

export function syncTasks (gulp, opts) {

  const runSequence = require('run-sequence').use(gulp);

  gulpTasksCore(gulp);

  const options = gulpOptionsBuilder(opts);

  gulp.task('syncPre', (callback) => runSequence('dist', callback));

  gulp.task('sync', ['syncPre'], () => {
    if (options.sync) {
      gulp.src(options.dist)
        .pipe(rsync({
          root: options.dist,
          hostname: options.sync.hostname,
          username: options.sync.username,
          destination: options.sync.remoteDestination,
          recursive: true,
          relative: true,
          incremental: true,
          silent: true,
          clean: true,
          emptyDirectories: true,
          exclude: ['.DS_Store']
        }));
    }

  });
};

export default syncTasks;
