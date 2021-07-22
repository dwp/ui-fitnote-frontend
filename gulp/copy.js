/* istanbul ignore next */
var gulp = require('gulp'),
    copy = require('gulp-copy');

/* istanbul ignore next */
gulp.task('copyImages', function copyImages(done) {
    gulp.src(gulpPaths.src.assets.images + '**/*')
    .pipe(gulp.dest(gulpPaths.dest.images));
    done();
});

/* istanbul ignore next */
gulp.task('copyFonts', function copyJs(done) {
    gulp.src(gulpPaths.src.assets.fonts + '**/*')
    .pipe(gulp.dest(gulpPaths.dest.fonts));
    done();
});

gulp.task('copy', gulp.series('copyImages', 'copyFonts'));
