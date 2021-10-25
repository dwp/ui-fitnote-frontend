const gulp = require('gulp');

const { watch } = gulp;
const runSequence = require('gulp4-run-sequence');

const srcdir = './app/';

gulp.task('watch', () => {
  watch(`${srcdir}**/*.js`, () => {
    runSequence('js');
  });
  watch(`${srcdir}**/*.scss`, () => {
    runSequence('sass');
  });
});
