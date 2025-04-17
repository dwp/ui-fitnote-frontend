/* istanbul ignore next */
import gulp from 'gulp';
import del from 'del';
import gulpPaths from './_paths.js';

/* istanbul ignore next */
gulp.task('clean', (cb) => del([`${gulpPaths.dest.root}**`], cb));
