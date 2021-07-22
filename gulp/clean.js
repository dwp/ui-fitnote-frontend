/* istanbul ignore next */
var gulp = require('gulp'),
    del = require('del');

/* istanbul ignore next */
gulp.task('clean', function(cb) {
    return del([gulpPaths.dest.root + '**'], cb);
});
