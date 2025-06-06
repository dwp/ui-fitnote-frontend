/* eslint-disable no-underscore-dangle */
// Fit Note Application
import nunjucks from 'nunjucks';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import async from 'async';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import expressSanitized from 'express-sanitized';
import timeout from 'connect-timeout';
import path from 'path';
import config from 'config';
import { fileURLToPath } from 'url';

import { UNSAFE_INLINE } from './constants.js';

// middleware
import cookieConsentMW from './middleware/cookie-consent.js';
import { generateNonce, attachNonceToLocals } from './middleware/nonce.js';
import timeoutDialogMW from './middleware/timeout-dialog.js';

import init from './functions/i18n.js';

import logger from './functions/bunyan.js';
import routes from './routes.js';

import apiCheck from './functions/checkServer.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nonce = generateNonce();

// Global Vars
const oneYear = 31557600000;

const appRootDirectory = path.join(__dirname, '/..');

apiCheck(config.get('api.url'));

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
const googleAnalytics = '*.google-analytics.com';
const googleTM = '*.googletagmanager.com';
let upgradeInsecureRequests = [];

// Only upgrade http requests in production
if (process.env.NODE_ENV !== 'production') {
  upgradeInsecureRequests = null;
}

app.use(parallel([
  helmet({
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'${UNSAFE_INLINE}'`, googleAnalytics, googleTM, 'https://tagmanager.google.com'],
        connectSrc: ["'self'", googleAnalytics, '*.analytics.google.com', googleTM],
        styleSrc: ["'self'", `'${UNSAFE_INLINE}'`, 'data:', 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https: data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', googleAnalytics, '*.analytics.google.com', googleTM, 'https://ssl.gstatic.com', 'https://www.gstatic.com'],
        frameSrc: ["'self'", googleTM],
        frameAncestors: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests,
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
  const env = nunjucks.configure([path.join(__dirname, '../app/views'), path.join(__dirname, '../node_modules/hmrc-frontend'), path.join(__dirname, '../node_modules/@ministryofjustice'), path.join(__dirname, '../node_modules/home-office-kit')], {
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
        logger.info(`Tried to render page: ${name}`);
        logger.error(err);
        res.redirect('/');
      } else {
        res.send(data);
      }
    }));
  };

  next();
});

init(app, ['app/locales'], ['en', 'cy']);

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

export default app;
