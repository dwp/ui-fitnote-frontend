/* istanbul ignore next */
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    spawn = require('child_process').spawn;

/* istanbul ignore next */
var bunyan;

/* istanbul ignore next */
function runNodemon(env) {
    nodemon({
        script : './bin/server.js',
        ext : 'js',
        ignore : ['/assets/**/*', '/public/**/*', '/scripts/**/*'],
        env : {
            'NODE_ENV' : env
        },
        stdout :   false,
        readable : false
    })

    .on('readable', function readLogging() {
        // free memory
        /*eslint no-unused-expressions: "off"*/
        bunyan && bunyan.kill();

        bunyan = spawn('./node_modules/bunyan/bin/bunyan', [
            '--output', 'short',
            '--color'
        ]);

        bunyan.stdout.pipe(process.stdout);
        bunyan.stderr.pipe(process.stderr);
        this.stdout.pipe(bunyan.stdin);
        this.stderr.pipe(bunyan.stdin);
    });
}

/* istanbul ignore next */
gulp.task('nodemon', ['watch'], function ndLocal(callback) {
    runNodemon('dev', callback);
});
