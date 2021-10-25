/* istanbul ignore next */
const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const debug = require('gulp-debug');
const gulpPaths = require('./_paths');

/* istanbul ignore next */
gulp.task('css-build', () => gulp.src(gulpPaths.src.assets.scssApp)
  .pipe(debug({ title: 'Compiling Sass file : ' }))
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(gulpPaths.dest.css)));
