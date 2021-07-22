/* istanbul ignore next */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug');

/* istanbul ignore next */

/* istanbul ignore next */
gulp.task('js-app-build', function appBuild() {
    return gulp.src(gulpPaths.src.assets.jsLocal)
    // .pipe(debug({title : 'Concatenating JS Client file : '}))
    // .pipe(concat('app.js'))
    .pipe(gulp.dest(gulpPaths.dest.js));
});

/* istanbul ignore next */
gulp.task('js-govuk-build', function govukBuild() {
    return gulp.src(gulpPaths.src.assets.jsgovuk)
        .pipe(debug({title : 'Concatenating JS govuk file : '}))
        .pipe(concat('govuk.js'))
        .pipe(gulp.dest(gulpPaths.dest.js));
});

/* istanbul ignore next */
gulp.task('js-vendor-build', function vendorBuild() {
    return gulp.src(gulpPaths.src.assets.jsVendor)
        .pipe(debug({title : 'Concatenating JS vendor file : '}))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(gulpPaths.dest.js));
});

gulp.task('js-build', gulp.series('js-govuk-build', 'js-app-build', 'js-vendor-build'));
