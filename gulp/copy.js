/* istanbul ignore next */
var gulp = require('gulp'),
    copy = require('gulp-copy');

/* istanbul ignore next */
gulp.task('copy', ['copyImages', 'copyFonts']);

/* istanbul ignore next */
gulp.task('copyImages', function copyImages() {
    gulp.src(gulpPaths.src.assets.images + '**/*')
    .pipe(gulp.dest(gulpPaths.dest.images));
});

/* istanbul ignore next */
gulp.task('copyFonts', function copyJs() {
    gulp.src(gulpPaths.src.assets.fonts + '**/*')
    .pipe(gulp.dest(gulpPaths.dest.fonts));
});
