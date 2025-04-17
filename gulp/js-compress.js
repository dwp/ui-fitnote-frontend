/* istanbul ignore next */
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import pump from 'pump';

gulp.task('js-compress', (cb) => {
    pump([
            gulp.src('./public/javascript/*.js'),
            uglify(),
            gulp.dest('./public/javascript'),
        ],
        cb);
});
