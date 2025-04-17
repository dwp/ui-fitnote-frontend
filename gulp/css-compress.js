/* istanbul ignore next */
import gulp from 'gulp';
import csso from 'gulp-csso';
import gulpPaths from './_paths.js';

/* istanbul ignore next */
gulp.task('css-compress', gulp.series('css-build', () => gulp.src(`${gulpPaths.dest.css}/*.css`)
    .pipe(csso())
    .pipe(gulp.dest(gulpPaths.dest.css))));
