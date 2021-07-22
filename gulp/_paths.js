/* istanbul ignore next */
gulpPaths = {
    src : {
        assets : {
            images : './assets/images/',
            fonts : './assets/fonts/',
            javaScript : './assets/**/*',
            jsgovuk : './assets/govuk/**/*',
            jsLocal : './assets/js-local/**/*',
            jsHmrc : './assets/js-hmrc/**/*',
            jsVendor : './assets/js-vendor/**/*',
            scssAll : './assets/scss/**/*',
            scssApp : './assets/scss/*.scss'
        },
        nodeJs : './app/**/*.js',
        appHtml : './app/**/*.html'
    },
    dest : {
        root : './public',
        jsFiles : './public/javascript/*.js',
        js : './public/javascript',
        images : './public/images',
        fonts : './public/fonts',
        css : './public/stylesheets'
    }
};

