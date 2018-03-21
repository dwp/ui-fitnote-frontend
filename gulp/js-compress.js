/* istanbul ignore next */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    pump = require('pump');

gulp.task('js-compress', function compressJavaScript(cb) {
    pump([
        gulp.src('./public/javascript/*.js'),
        uglify(),
        gulp.dest('./public/javascript')
    ],
    cb
  );
});
