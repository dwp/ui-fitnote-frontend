/* istanbul ignore next */
const gulp = require('gulp');
const mocha = require('gulp-mocha');

/* istanbul ignore next */
gulp.task('mocha', () => gulp.src('testing/mocha/**/*.js').pipe(mocha()).once('error', () => {
  process.exit(1);
}).once('end', () => {
  process.exit();
}));
