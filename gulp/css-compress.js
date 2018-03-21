/* istanbul ignore next */
var gulp = require('gulp'),
    csso = require('gulp-csso');

/* istanbul ignore next */
gulp.task('css-compress', ['css-build'], function cssCombine() {
    return gulp.src(gulpPaths.dest.css + '/*.css')
        .pipe(csso())
        .pipe(gulp.dest(gulpPaths.dest.css));
});
