/* istanbul ignore next */
const gulp = require('gulp');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const gulpPaths = require('./_paths');

/* istanbul ignore next */

/* istanbul ignore next */
gulp.task('js-app-build', () => gulp.src(gulpPaths.src.assets.jsLocal)
// .pipe(debug({title : 'Concatenating JS Client file : '}))
// .pipe(concat('app.js'))
  .pipe(gulp.dest(gulpPaths.dest.js)));

/* istanbul ignore next */
gulp.task('js-govuk-build', () => gulp.src(gulpPaths.src.assets.jsgovuk)
  .pipe(debug({ title: 'Concatenating JS govuk file : ' }))
  .pipe(concat('govuk.js'))
  .pipe(gulp.dest(gulpPaths.dest.js)));

gulp.task('js-build', gulp.series('js-govuk-build', 'js-app-build'));
