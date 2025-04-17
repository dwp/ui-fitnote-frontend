/* istanbul ignore next */
import gulp from 'gulp';
import gulpPaths from './_paths.js';

/* istanbul ignore next */
gulp.task('copyImages', (done) => {
    gulp.src(`${gulpPaths.src.assets.images}**/*`, { encoding: false })
        .pipe(gulp.dest(gulpPaths.dest.images));
    done();
});

/* istanbul ignore next */
gulp.task('copyFonts', (done) => {
    gulp.src(`${gulpPaths.src.assets.fonts}**/*`)
        .pipe(gulp.dest(gulpPaths.dest.fonts));
    done();
});

gulp.task('copy', gulp.series('copyImages', 'copyFonts'));
