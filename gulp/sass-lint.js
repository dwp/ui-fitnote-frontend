/* istanbul ignore next */
var gulp = require('gulp'),
    sassLint = require('gulp-sass-lint');

/* istanbul ignore next */
// gulp.task('sass-lint', function sassLintTask() {
//     return gulp.src(gulpPaths.src.assets.scssAll)
//     .pipe(sassLint({configFile : './.sass-lint.yml'}))
//     .pipe(sassLint.format())
//     .pipe(sassLint.failOnError());
// });

/* istanbul ignore next */
gulp.task('sassLint', function () {
    var stream = gulp.src('./assets/scss/*.scss')
        .pipe(sassLint({
            options: {
                'config-file': './testing/configs/.sass-lint.yml'
            }
        }))
        .pipe(sassLint.format());
    stream.on('finish', function() {
        sassLint.format().end();
    });
    return stream;
});

/* istanbul ignore next */
gulp.task('sassLintProd', function () {
    var stream = gulp.src('./assets/scss/*.scss')
        .pipe(sassLint({
            options: {
                'config-file': './testing/configs/.sass-lint.yml'
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
        stream.on('finish', function() {
            sassLint.format().end();
        });
    return stream;
});
