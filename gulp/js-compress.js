/* istanbul ignore next */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const pump = require('pump');

gulp.task('js-compress', (cb) => {
  pump([
    gulp.src('./public/javascript/*.js'),
    uglify(),
    gulp.dest('./public/javascript'),
  ],
  cb);
});
