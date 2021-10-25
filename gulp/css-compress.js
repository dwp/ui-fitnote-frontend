/* istanbul ignore next */
const gulp = require('gulp');
const csso = require('gulp-csso');
const gulpPaths = require('./_paths');

/* istanbul ignore next */
gulp.task('css-compress', gulp.series('css-build', () => gulp.src(`${gulpPaths.dest.css}/*.css`)
  .pipe(csso())
  .pipe(gulp.dest(gulpPaths.dest.css))));
