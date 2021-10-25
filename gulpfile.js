const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('gulp4-run-sequence');

// Load the gulp task files
requireDir('./gulp');

// Run all tests, try all things so we can spot problems early. Runs watch task
gulp.task('dev', (done) => {
  'use strict';

  runSequence(
    'clean',
    'copy',
    'js-build',
    ['css-compress', 'js-compress'],
    'nodemon',
  );
  done();
});

// Production task, build all the resources ready for Node to serve.
gulp.task('jenkins', (done) => {
  'use strict';

  runSequence(
    'clean',
    'copy',
    'js-build',
    ['css-compress', 'js-compress'],
  );
  done();
});
