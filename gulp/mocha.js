/* istanbul ignore next */
var gulp   = require('gulp'),
mocha   = require('gulp-mocha');


/* istanbul ignore next */
gulp.task('mocha', function () {
    return gulp.src('testing/mocha/**/*.js').pipe(mocha()).once('error', function () {
        process.exit(1);
    }).once('end', function () {
        process.exit();
    });
});
