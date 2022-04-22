// Fit Note Application
const nunjucks = require('nunjucks');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const async = require('async');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const expressSanitized = require('express-sanitized');
const timeout = require('connect-timeout');
const path = require('path');
const config = require('config');

const app = express();

const { UNSAFE_INLINE } = require('./constants');

// middleware
const cookieConsentMW = require('./middleware/cookie-consent');
const { generateNonce, attachNonceToLocals } = require('./middleware/nonce');
const timeoutDialogMW = require('./middleware/timeout-dialog');

const nonce = generateNonce();

// Global Vars
const oneYear = 31557600000;

const appRootDirectory = path.join(__dirname, '/..');

const logger = require('./functions/bunyan');
const routes = require('./routes');

const serviceCheck = require('./functions/checkServer');

serviceCheck.apiCheck(config.get('api.url'));

// Initialise The Application
// Use Async and parallel function to load in parallel
function parallel(middlewares) {
  return function asyncType(req, res, next) {
    async.each(middlewares, (mw, cb) => {
      mw(req, res, cb);
    }, next);
  };
}

function haltOnTimedout(req, res, next) {
  return !req.timedout ? next() : null;
}

// 1. Load Helmet Security Protocols
// 2. Load Cookie Parser
// 3. Support JSON-encoded bodies
// 4. Support URL-encoded bodies
// 5. Line MUST follow express.bodyParser() to sanitize code.
// 6. Google tag manager nonce
// 7. ANY static content MUST be in the public area or it will not get served.
// 8. Required to serve Favicon
const analyticsLink = 'https://www.google-analytics.com';
app.use(parallel([
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'${UNSAFE_INLINE}'`, 'https://www.googletagmanager.com', analyticsLink],
        connectSrc: ["'self'", analyticsLink],
        styleSrc: ["'self'", `'${UNSAFE_INLINE}'`, 'data:'],
        fontSrc: ["'self'", 'https: data:'],
        imgSrc: ["'self'", 'data:', 'www.googletagmanager.com', analyticsLink],
      },
    },
    hsts: false,
  }), // (1)
  cookieParser(), // (2)
  timeout(240000),
  bodyParser.json(), // (3)
  haltOnTimedout,
  timeout(240000),
  bodyParser.urlencoded({ extended: true }), // (4)
  cookieConsentMW,
  haltOnTimedout,
  expressSanitized(), // (5)
  attachNonceToLocals(nonce), // (6)
  timeoutDialogMW,
  express.static(`${appRootDirectory}/public`, { maxAge: oneYear }), // (7)
  favicon('public/images/favicon.ico'), // (8)
]));

// Set Nunjucks as rendering engine for pages with .html suffix
app.set('view engine', 'html');

/**
 * Setup a nunjucks environment, per request, so we can tailor the environment
 * to the needs of the request (e.g. Using a specific language for rendering).
 *
 * This is available on all application routes, not just CASA router, so you
 * can use the same Nunjucks environment on application-specific routes.
 */
app.use((req, res, next) => {
  const env = nunjucks.configure([path.join(__dirname, '../app/views'), path.join(__dirname, '../node_modules/hmrc-frontend')], {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: false,
    lstripBlocks: false,
  });
  env.addGlobal('getContext', () => this.ctx);
  res.nunjucksEnvironment = env;

  // Handling URIErrors
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    res.redirect('/404');
  }

  // Customise the `render()` response method to use this specific Nunjucks
  // environment for the current request.
  res.render = (name, opts, callback) => {
    const nameRender = `${name}.${app.get('view engine')}`;
    const optsRender = { ...opts || {}, ...res.locals || {} };
    env.render(nameRender, optsRender, callback || ((err, data) => {
      if (err) {
        throw new Error(err);
      } else {
        res.send(data);
      }
    }));
  };

  next();
});

require('./functions/i18n.js')(app, ['app/locales'], ['en', 'cy']);

// Make Variables in config.js available to Nunjucks templates
app.use((req, res, next) => {
  res.locals.assetPath = /"public"/;
  next();
});

// Built-in static assets are served at /public, any other govuk-frontend assets are in node_modules
app.use('/assets', express.static(`${appRootDirectory}/node_modules/govuk-frontend/govuk/assets`));
app.use('/govuk/all.js', express.static(`${appRootDirectory}/node_modules/govuk-frontend/govuk/all.js`));

// Routes
if (typeof (routes) !== 'function') {
  logger.error(routes.bind);
  logger.error('Warning routes not configured correctly');
  routes.bind(app);
} else {
  app.use('/', routes);
}

module.exports = app;
