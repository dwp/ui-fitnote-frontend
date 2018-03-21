/* istanbul ignore next */
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence');

/* istanbul ignore next */
var reload = browserSync.reload;

/* istanbul ignore next */
gulp.task('watch', function watchTask(callback) {
    browserSync.init(null, {
        proxy : 'localhost:3000',
        port : 3001,
        open : false,
        notify : false
    });

    gulp.watch(gulpPaths.src.nodeJs, ['eslint']).on('change', reload);
    gulp.watch(gulpPaths.src.assets.scssAll, ['css-compress', 'sassLint']).on('change', reload);
    gulp.watch(gulpPaths.src.assets.javaScript, function watchSequence() {
        runSequence(
            'js-build',
            'js-compress',
            'eslint'
        );
    }).on('change', reload);
    gulp.watch(gulpPaths.src.appHtml).on('change', reload);
    callback();
});
