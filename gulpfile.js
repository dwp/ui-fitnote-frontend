var gulp   = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

// Load the gulp task files
requireDir('./gulp');

// Run all tests, try all things so we can spot problems early. Runs watch task
gulp.task('dev', function(){
    'use strict';
    runSequence(
        'clean',
        'copy',
        'js-build',
        ['css-compress','js-compress'],
        'eslint',
        'sassLint',
        'nodemon'
    );
});

// Production task, build all the resources ready for Node to serve.
gulp.task('jenkins', function(){
    'use strict';
    runSequence(
        'clean',
        'copy',
        'js-build',
        ['css-compress','js-compress'],
        'eslintProd',
        'sassLintProd'
    );
});
