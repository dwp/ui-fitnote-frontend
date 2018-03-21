/* istanbul ignore next */
var gulp = require('gulp'),
    del = require('del');

/* istanbul ignore next */
gulp.task('clean', function cleanUp() {
    return del([gulpPaths.dest.root + '**']);
});
