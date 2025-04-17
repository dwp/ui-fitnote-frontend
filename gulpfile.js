import gulp from 'gulp';

import './gulp/clean.js';
import './gulp/copy.js';
import './gulp/js-build.js';
import './gulp/css-build.js';
import './gulp/css-compress.js';
import './gulp/js-compress.js';
import './gulp/nodemon.js';

// Run all tests, try all things so we can spot problems early. Runs watch task
gulp.task('dev', gulp.series(
    'clean',
    'copy',
    'js-build',
    gulp.parallel('css-compress', 'js-compress'),
    'watch'
));

// Production task, build all the resources ready for Node to serve.
gulp.task('jenkins', gulp.series(
    'clean',
    'copy',
    'js-build',
    gulp.parallel('css-compress', 'js-compress'),
    'watch'
));

export default gulp;
