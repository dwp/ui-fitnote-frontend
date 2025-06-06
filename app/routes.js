import express from 'express';

import config from 'config';

// getControllers
import esaGet from './controllers/get/esa.js';
import methodObtainedGet from './controllers/get/methodObtained.js';
import noEsaGet from './controllers/get/noEsa.js';
import fitnoteNeededGet from './controllers/get/fitnoteNeeded.js';
import noFitnoteNeededGet from './controllers/get/noFitnoteNeeded.js';
import guidanceGet from './controllers/get/guidance.js';
import guidancePostGet from './controllers/get/guidancePost.js';
import takePhotoGet from './controllers/get/takePhoto.js';
import photoAuditGet from './controllers/get/photoAudit.js';
import photoStatusGet from './controllers/get/photoStatus.js';
import ninoGet from './controllers/get/nino.js';
import addressGet from './controllers/get/address.js';
import textMessageGet from './controllers/get/textMessage.js';
import completeGet from './controllers/get/complete.js';
import checkYourAnswersGet from './controllers/get/checkYourAnswers.js';
import cookiePolicyGet from './controllers/get/cookiePolicy.js';
import cookiesDetailsGet from './controllers/get/cookiesDetails.js';
import accessibilityGet from './controllers/get/accessibilityStatement.js';
import unprocessableEntityGet from './controllers/get/photoQualityError.js';
import desktopUnprocessableEntityGet from './controllers/get/desktopPhotoQualityError.js';
import serverErrorGet from './controllers/get/serverError.js';
import timeoutGet from './controllers/get/sessionTimeout.js';
import sessionGet from './controllers/get/refresh.js';

// postContollers
import esaPost from './controllers/post/esa.js';
import fitnoteNeededPost from './controllers/post/fitnoteNeeded.js';
import methodObtainedPost from './controllers/post/methodObtained.js';
import photoPost from './controllers/post/sendPhoto.js';
import guidancePost from './controllers/post/guidance.js';
import ninoPost from './controllers/post/sendNino.js';
import addressPost from './controllers/post/sendAddress.js';
import textMessagePost from './controllers/post/sendTextMessage.js';
import acceptProcessPost from './controllers/post/submitDeclaration.js';
import checkYourAnswersPost from './controllers/post/checkYourAnswers.js';

// functions
import authentication from './functions/isAuthenticated.js';
import legal from './functions/hasViewedCookieMessage.js';
import cookieSettings from './functions/updateCookieSettings.js';

// middlewares
import healthcheck from './middleware/healthcheck.js';

const router = new express.Router();

const isAuthenticatedFunction = authentication;

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
router.get('/cookie-agree/', legal);
router.get('/cookies/cookie_policy', isAuthenticatedFunction, cookiePolicyGet);
router.get('/cookies/cookies_details', isAuthenticatedFunction, cookiesDetailsGet);
router.get('/accessibility-statement', isAuthenticatedFunction, accessibilityGet);
router.get('/refresh-session', sessionGet);

// Fitnote Pages
router.get('/index', redirectGovUk);
router.get('/esa', esaGet);
router.get('/method-obtained', isAuthenticatedFunction, methodObtainedGet);
router.get('/no-esa', isAuthenticatedFunction, noEsaGet);
router.get('/check-fit-note-needed', isAuthenticatedFunction, fitnoteNeededGet);
router.get('/no-fit-note-needed', isAuthenticatedFunction, noFitnoteNeededGet);
router.get(['/guidance-digital', '/guidance-paper'], isAuthenticatedFunction, guidanceGet);
router.get('/guidance-post', isAuthenticatedFunction, guidancePostGet);
router.get('/upload', isAuthenticatedFunction, takePhotoGet);
router.get('/photo-audit', isAuthenticatedFunction, photoAuditGet);
router.get('/photo-status', isAuthenticatedFunction, photoStatusGet);
router.get('/nino', isAuthenticatedFunction, ninoGet);
router.get('/address', isAuthenticatedFunction, addressGet);
router.get('/change-number', isAuthenticatedFunction, textMessageGet);
router.get('/text-message', isAuthenticatedFunction, textMessageGet);
router.get('/complete', isAuthenticatedFunction, completeGet);
router.get('/check-your-answers', isAuthenticatedFunction, checkYourAnswersGet);

// Feedback redirect to MS forms
router.get('/feedback', (req, res) => {
  res.redirect(308, 'https://forms.office.com/pages/responsepage.aspx?id=DpxP-knna0i8NIr6EGM3VsmUfSVlj39Dm5IoDLk2jmRUMThGTFhLMURFTkRISFdKMTA0U1dWUTg3NiQlQCN0PWcu');
});

// Accessibility Tests GET only

if (config.util.getEnv('NODE_ENV') === 'test') {
  router.get('/cookie-agree/:id', legal);

  // Fitnote Pages
  router.get('/take-a-photo/:id', isAuthenticatedFunction, takePhotoGet);
  // router.get('/photo-audit/:id', isAuthenticatedFunction, photoAuditGet.photoAuditPage);
  router.get('/nino/:id', isAuthenticatedFunction, ninoGet);
  router.get('/address/:id', isAuthenticatedFunction, addressGet);
  router.get('/text-message/:id', isAuthenticatedFunction, textMessageGet);
  router.get('/complete/:id', isAuthenticatedFunction, completeGet);
}

// Post Controllers
router.post('/esa', esaPost);
router.post('/check-fit-note-needed', fitnoteNeededPost);
router.post('/method-obtained', methodObtainedPost);
router.post('/update-cookie-settings', cookieSettings);
router.post('/send-photo', photoPost);
router.post(['/guidance-digital', '/guidance-paper'], guidancePost);
router.post('/send-nino', ninoPost);
router.post('/send-text-message', textMessagePost);
router.post('/send-address', addressPost);
router.post('/submit-declaration', acceptProcessPost);
router.post('/check-your-answers', checkYourAnswersPost);

// Endpoints
router.get('/healthcheck', healthcheck);

// ERRORS (must be defined after all routes)
router.get('/422', unprocessableEntityGet);
router.get('/422-desktop', desktopUnprocessableEntityGet);
router.get('/500', serverErrorGet);
router.get('/session-timeout', timeoutGet);

// Catch all unknown routes and redirect to 404 page
router.use('/*splat', catchAll);

// NOTHING AFTER THIS
export default router;
