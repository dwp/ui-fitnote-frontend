/* istanbul ignore next */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    debug = require('gulp-debug'),
    browserSync = require('browser-sync');

    /* istanbul ignore next */
gulp.task('css-build', function cssBuilder() {
    var processors = [
        autoprefixer({browsers : ['last 2 versions', 'ie 8', 'ie 9']})
    ];

    return gulp.src(gulpPaths.src.assets.scssApp)
        .pipe(debug({title : 'Compiling Sass file : '}))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(gulpPaths.dest.css))
        .pipe(browserSync.stream());
});
