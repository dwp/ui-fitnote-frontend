/* istanbul ignore next */
import gulp from 'gulp';
import mocha from 'gulp-mocha';

/* istanbul ignore next */
gulp.task('mocha', () => gulp.src('testing/mocha/**/*.js').pipe(mocha()).once('error', () => {
  process.exit(1);
}).once('end', () => {
  process.exit();
}));
