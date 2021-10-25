/* istanbul ignore next */
const gulp = require('gulp');
const gulpPaths = require('./_paths');

/* istanbul ignore next */
gulp.task('copyImages', (done) => {
  gulp.src(`${gulpPaths.src.assets.images}**/*`)
    .pipe(gulp.dest(gulpPaths.dest.images));
  done();
});

/* istanbul ignore next */
gulp.task('copyFonts', (done) => {
  gulp.src(`${gulpPaths.src.assets.fonts}**/*`)
    .pipe(gulp.dest(gulpPaths.dest.fonts));
  done();
});

gulp.task('copy', gulp.series('copyImages', 'copyFonts'));
