/* istanbul ignore next */
import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import debug from 'gulp-debug';
import gulpPaths from './_paths.js';

/* istanbul ignore next */
gulp.task('css-build', () => gulp.src(gulpPaths.src.assets.scssApp)
    .pipe(debug({ title: 'Compiling Sass file : ' }))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(gulpPaths.dest.css)));
