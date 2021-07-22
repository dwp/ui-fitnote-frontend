/* istanbul ignore next */
var gulp = require('gulp'),
    sass = require('gulp-dart-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    debug = require('gulp-debug');

/* istanbul ignore next */
gulp.task('css-build', function cssBuilder() {
    return gulp.src(gulpPaths.src.assets.scssApp)
        .pipe(debug({title : 'Compiling Sass file : '}))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(gulpPaths.dest.css));
});
