import gulp from 'gulp';

const { watch } = gulp;
import runSequence from 'gulp4-run-sequence';

const srcdir = './app/';

gulp.task('watch', (done) => {
  watch(`${srcdir}**/*.js`,{ persistent: false }, () => {
    runSequence('js');
  });
  watch(`${srcdir}**/*.scss`, { persistent: false }, () => {
    runSequence('sass');
  });
  done();
});
