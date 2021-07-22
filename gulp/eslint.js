/* istanbul ignore next */
var gulp = require('gulp'),
    eslint = require('gulp-eslint');

/* istanbul ignore next */
gulp.task('eslint', function goEslint() {
    return gulp.src([gulpPaths.src.nodeJs])
        .pipe(eslint('./.eslintrc.js'))
        .pipe(eslint.format());
});

/* istanbul ignore next */
gulp.task('eslintProd', function goEslintProd() {
    return gulp.src([gulpPaths.src.nodeJs])
        .pipe(eslint('./.eslintrc.js'))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
