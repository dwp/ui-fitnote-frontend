/* istanbul ignore next */
var gulp = require('gulp'),
    concat = require('gulp-concat');

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

/* jquery */
gulp.task('copyJquery', function copyJquery(done) {
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(concat('jquery.min.js'))
        .pipe(gulp.dest(gulpPaths.dest.js));
    done();
});

gulp.task('copy', gulp.series('copyImages', 'copyFonts', 'copyJquery'));
