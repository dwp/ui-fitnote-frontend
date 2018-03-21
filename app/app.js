// Fit Note Application
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var ua = require('universal-analytics');
var nunjucks = require('nunjucks');
var favicon = require('serve-favicon');
var helmet = require('helmet');
var async = require('async');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var expressSanitized = require('express-sanitize-escape');
var timeout = require('connect-timeout');
var path = require('path');
var app = express();

// Global Vars
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var oneYear = 31557600000;
var routes;

appRootDirectory = path.join(__dirname, '/..');
config = require(appRootDirectory + '/app/config.js');
logger = require(appRootDirectory + '/app/functions/bunyan');
routes = require(appRootDirectory + '/app/routes.js');

// Initialise The Application
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Use Async and parallel function to load in parallel
function parallel(middlewares) {
    return function asyncType(req, res, next) {
        async.each(middlewares, function eachAsync(mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}

function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
        next();
    }
}

// 1. Load Helmet Security Protocols
// 2. Load Cookie Parser
// 3. Support JSON-encoded bodies
// 4. Support URL-encoded bodies
// 5. Line MUST follow express.bodyParser() to sanitize code.
// 6. ANY static content MUST be in the public area or it will not get served.
// 7. Required to serve Favicon
// 8. Universal GA
app.use(parallel([
    helmet({
        contentSecurityPolicy : {
            directives : {
                scriptSrc : ["'self'", "'unsafe-inline'", 'https://www.google-analytics.com/']
            }
        },
        hsts : false
    }), //(1)
    cookieParser(), //(2)
    timeout(240000),
    bodyParser.json(), //(3)
    haltOnTimedout,
    timeout(240000),
    bodyParser.urlencoded({extended : true}), //(4)
    haltOnTimedout,
    expressSanitized.middleware(), //(5)
    express.static(appRootDirectory + '/public', {maxAge : oneYear}), //(6)
    favicon('public/images/favicon.ico'), //(7)
    ua.middleware('UA-57523228-37', {cookieName : '_ga'}) //(8)
]));

// Set Nunjucks as rendering engine for pages with .html suffix
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.set('view engine', 'html');

// Prepare a file loader for use with all Nunjucks environments
const loader = new nunjucks.FileSystemLoader('app/views', {
    watch : false,
    noCache : false
});

/**
* Setup a nunjucks environment, per request, so we can tailor the environment
* to the needs of the request (e.g. using a specific language for rendering).
*
* This is available on all application routes, not just CASA router, so you
* can use the same Nunjucks environment on application-specific routes.
*/
app.use(function(req, res, next) {
    const env = new nunjucks.Environment(loader, {
        autoescape : true,
        throwOnUndefined : false,
        trimBlocks : false,
        lstripBlocks : false
    });
    res.nunjucksEnvironment = env;

    // Customise the `render()` response method to use this specific Nunjucks
    // environment for the current request.
    res.render = function(name, opts, callback) {
        name = name + '.' + app.get('view engine');
        opts = Object.assign({}, opts || {}, res.locals || {});
        env.render(name, opts, callback || function(err, data) {
            if (err) {
                throw new Error(err);
            } else {
                res.send(data);
            }
        });
    };

    next();
});

require('./functions/i18n.js')(app, ['app/locales'], ['en', 'cy']);

// Make Variables in config.js available to Nunjucks templates
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(function configExpose(req, res, next) {
    res.locals.assetPath = /"public"/;
    next();
});

// Routes
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if (typeof (routes) !== 'function') {
    logger.error(routes.bind);
    logger.error('Warning routes not configured correctly');
    routes.bind(app);
} else {
    app.use('/', routes);
}

module.exports = app;
