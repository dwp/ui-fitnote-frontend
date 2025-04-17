/* istanbul ignore next */
import gulp from 'gulp';
import gulpPaths from './_paths.js';

/* istanbul ignore next */
gulp.task('js-build', () => gulp.src(gulpPaths.src.assets.jsLocal)
    .pipe(gulp.dest(gulpPaths.dest.js)));
