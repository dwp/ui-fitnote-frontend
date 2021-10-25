/* istanbul ignore next */
const gulp = require('gulp');
const del = require('del');
const gulpPaths = require('./_paths');

/* istanbul ignore next */
gulp.task('clean', (cb) => del([`${gulpPaths.dest.root}**`], cb));
