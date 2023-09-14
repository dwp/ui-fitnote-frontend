const express = require('express');

const router = new express.Router();
const config = require('config');

// getControllers
const esaGet = require('./controllers/get/esa');
const methodObtainedGet = require('./controllers/get/methodObtained');
const noEsaGet = require('./controllers/get/noEsa');
const guidanceGet = require('./controllers/get/guidance');
const takePhotoGet = require('./controllers/get/takePhoto');
const photoAuditGet = require('./controllers/get/photoAudit');
const photoStatusGet = require('./controllers/get/photoStatus');
const ninoGet = require('./controllers/get/nino');
const addressGet = require('./controllers/get/address');
const textMessageGet = require('./controllers/get/textMessage');
const completeGet = require('./controllers/get/complete');
const feedbackGet = require('./controllers/get/feedback');
const checkYourAnswersGet = require('./controllers/get/checkYourAnswers');
const cookiePolicyGet = require('./controllers/get/cookiePolicy');
const cookiesDetailsGet = require('./controllers/get/cookiesDetails');
const accessibilityGet = require('./controllers/get/accessibilityStatement');
const unprocessableEntityGet = require('./controllers/get/photoQualityError');
const desktopUnprocessableEntityGet = require('./controllers/get/desktopPhotoQualityError');
const serverErrorGet = require('./controllers/get/serverError');
const timeoutGet = require('./controllers/get/sessionTimeout');
const sessionGet = require('./controllers/get/refresh');

// postContollers
const esaPost = require('./controllers/post/esa');
const methodObtainedPost = require('./controllers/post/methodObtained');
const photoPost = require('./controllers/post/sendPhoto');
const guidancePost = require('./controllers/post/guidance');
const ninoPost = require('./controllers/post/sendNino');
const addressPost = require('./controllers/post/sendAddress');
const textMessagePost = require('./controllers/post/sendTextMessage');
const acceptProcessPost = require('./controllers/post/submitDeclaration');
const feedbackPost = require('./controllers/post/sendFeedback');
const checkYourAnswersPost = require('./controllers/post/checkYourAnswers');

// functions
const authentication = require('./functions/isAuthenticated');
const legal = require('./functions/hasViewedCookieMessage');
const cookieSettings = require('./functions/updateCookieSettings');

// middlewares
const healthcheck = require('./middleware/healthcheck');

const isAuthenticatedFunction = authentication.isAuthenticated;

// Controller Functions
function catchSlash(req, res) {
  res.redirect(`/esa?lang=${res.locals.language}`);
}

function redirectGovUk(req, res) {
  const url = res.locals.language === 'cy'
    ? 'https://www.gov.uk/anfon-eich-nodyn-ffitrwydd-ar-gyfer-eich-cais-esa'
    : 'https://www.gov.uk/send-fit-note';
  res.redirect(url);
}

function catchAll(req, res) {
  res.status(404).render('errors/404');
}

// Get Controllers
router.get('/', catchSlash);
router.get('/cookie-agree/', legal.hasViewedCookieMsg);
router.get('/cookies/cookie_policy', isAuthenticatedFunction, cookiePolicyGet.cookiePolicyPage);
router.get('/cookies/cookies_details', isAuthenticatedFunction, cookiesDetailsGet.cookiesDetailsPage);
router.get('/accessibility-statement', isAuthenticatedFunction, accessibilityGet.accessibilityPage);
router.get('/feedback', isAuthenticatedFunction, feedbackGet.feedbackPage);
router.get('/feedback-sent', feedbackGet.feedbackSentPage);
router.get('/refresh-session', sessionGet.refresh);

// Fitnote Pages
router.get('/index', redirectGovUk);
router.get('/esa', esaGet.esa);
router.get('/method-obtained', isAuthenticatedFunction, methodObtainedGet.methodObtained);
router.get('/no-esa', isAuthenticatedFunction, noEsaGet.noEsa);
router.get(['/guidance-digital', '/guidance-paper'], isAuthenticatedFunction, guidanceGet.guidance);
router.get('/upload', isAuthenticatedFunction, takePhotoGet.takePhotoPage);
router.get('/photo-audit', isAuthenticatedFunction, photoAuditGet.photoAuditPage);
router.get('/photo-status', isAuthenticatedFunction, photoStatusGet.photoStatus);
router.get('/nino', isAuthenticatedFunction, ninoGet.ninoPage);
router.get('/address', isAuthenticatedFunction, addressGet.addressPage);
router.get('/change-number', isAuthenticatedFunction, textMessageGet.textMessagePage);
router.get('/text-message', isAuthenticatedFunction, textMessageGet.textMessagePage);
router.get('/complete', isAuthenticatedFunction, completeGet.completePage);
router.get('/check-your-answers', isAuthenticatedFunction, checkYourAnswersGet.checkYourAnswersPage);

// Accessibility Tests GET only

if (config.util.getEnv('NODE_ENV') === 'test') {
  router.get('/cookie-agree/:id', legal.hasViewedCookieMsg);

  // Fitnote Pages
  router.get('/take-a-photo/:id', isAuthenticatedFunction, takePhotoGet.takePhotoPage);
  // router.get('/photo-audit/:id', isAuthenticatedFunction, photoAuditGet.photoAuditPage);
  router.get('/nino/:id', isAuthenticatedFunction, ninoGet.ninoPage);
  router.get('/address/:id', isAuthenticatedFunction, addressGet.addressPage);
  router.get('/text-message/:id', isAuthenticatedFunction, textMessageGet.textMessagePage);
  router.get('/complete/:id', isAuthenticatedFunction, completeGet.completePage);
}

// Post Controllers
router.post('/esa', esaPost.esa);
router.post('/method-obtained', methodObtainedPost.methodObtained);
router.post('/update-cookie-settings', cookieSettings.updateCookieSettings);
router.post('/send-photo', photoPost.sendPhoto);
router.post(['/guidance-digital', '/guidance-paper'], guidancePost.guidance);
router.post('/send-nino', ninoPost.sendNino);
router.post('/send-text-message', textMessagePost.sendTextMessageConfirmation);
router.post('/send-address', addressPost.sendAddress);
router.post('/submit-declaration', acceptProcessPost.submitDeclaration);
router.post('/feedback', feedbackPost.sendFeedback);
router.post('/check-your-answers', checkYourAnswersPost.acceptAndSend);

// Endpoints
router.get('/healthcheck', healthcheck.healthCheck);

// ERRORS (must be defined after all routes)
router.get('/422', unprocessableEntityGet.photoQualityError);
router.get('/422-desktop', desktopUnprocessableEntityGet.desktopPhotoQualityError);
router.get('/500', serverErrorGet.serverError);
router.get('/session-timeout', timeoutGet.sessionTimeout);

// Catch all unknown routes and redirect to 404 page
router.use('/*', catchAll);

// NOTHING AFTER THIS
module.exports = router;
