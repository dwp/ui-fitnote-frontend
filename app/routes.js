var express = require('express');
var router = new express.Router();
var functionPath = appRootDirectory + '/app/functions/';
var getControllerPath = appRootDirectory + '/app/controllers/get/';
var postControllerPath = appRootDirectory + '/app/controllers/post/';
var middlewarePath = appRootDirectory + '/app/middleware/';
const config = require('config');

var getControllers = {
    identify : require(getControllerPath + 'identify'),
    methodObtained : require(getControllerPath + 'methodObtained'),
    invalid  : require(getControllerPath + 'invalid'),
    device  : require(getControllerPath + 'device'),
    takePhoto  : require(getControllerPath + 'takePhoto'),
    helpForPhoto : require(getControllerPath + 'helpForPhoto'),
    nino : require(getControllerPath + 'nino'),
    address : require(getControllerPath + 'address'),
    changeNumber : require(getControllerPath + 'textMessage'),
    textMessage : require(getControllerPath + 'textMessage'),
    complete : require(getControllerPath + 'complete'),
    feedback : require(getControllerPath + 'feedback'),
    checkYourAnswers : require(getControllerPath + 'checkYourAnswers'),
    cookiePolicy : require(getControllerPath + 'cookiePolicy'),
    cookiesDetails : require(getControllerPath + 'cookiesDetails'),
    cookiesTable : require(getControllerPath + 'cookiesTable'),
    accessibility : require(getControllerPath + 'accessibilityStatement'),
    unprocessableEntity : require(getControllerPath + 'photoQualityError'),
    desktopUnprocessableEntity : require(getControllerPath + 'desktopPhotoQualityError'),
    timeout : require(getControllerPath + 'sessionTimeout'),
    session : require(getControllerPath + 'refresh')
};

var postControllers = {
    identify : require(postControllerPath + 'identify'),
    methodObtained : require(postControllerPath + 'methodObtained'),
    device  : require(postControllerPath + 'device'),
    photo : require(postControllerPath + 'sendPhoto'),
    nino : require(postControllerPath + 'sendNino'),
    address : require(postControllerPath + 'sendAddress'),
    textMessage : require(postControllerPath + 'sendTextMessage'),
    acceptProcess : require(postControllerPath + 'submitDeclaration'),
    feedback : require(postControllerPath + 'sendFeedback'),
    checkYourAnswers : require(postControllerPath + 'checkYourAnswers')
};

var functions = {
    authentication : require(functionPath + 'isAuthenticated'),
    legal : require(functionPath + 'hasViewedCookieMessage'),
    cookieSettings : require(functionPath + 'updateCookieSettings'),
    session : require(functionPath + 'createSessionId'),
    retry : require(functionPath + 'retryCookie')

};

var middlewares = {
    healthcheck : require(middlewarePath + 'healthcheck')
};

var isAuthenticatedFunction = functions.authentication.isAuthenticated;

// Controller Functions
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function catchSlash(req, res) {
    res.redirect('/identify?lang=' + res.locals.language);
}

function redirectGovUk(req, res) {
    var url = res.locals.language === 'cy' ?
        'https://www.gov.uk/anfon-eich-nodyn-ffitrwydd-ar-gyfer-eich-cais-esa' :
        'https://www.gov.uk/send-fit-note';
    res.redirect(url);
}

function catchAll(req, res) {
    res.status(404).render('errors/404');
}

// Get Controllers
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/', catchSlash);
router.get('/cookie-agree/', functions.legal.hasViewedCookieMsg);
router.get('/cookies/cookie_policy', isAuthenticatedFunction, getControllers.cookiePolicy.cookiePolicyPage);
router.get('/cookies/cookies_details', isAuthenticatedFunction, getControllers.cookiesDetails.cookiesDetailsPage);
router.get('/cookies-table', getControllers.cookiesTable.cookiesTablePage);
router.get('/accessibility-statement', isAuthenticatedFunction, getControllers.accessibility.accessibilityPage);
router.get('/feedback', isAuthenticatedFunction, getControllers.feedback.feedbackPage);
router.get('/thank-you', getControllers.feedback.thankYouPage);
router.get('/refresh-session', getControllers.session.refresh);

// Fitnote Pages
router.get('/index', redirectGovUk);
router.get('/identify', getControllers.identify.identify);
router.get('/device', isAuthenticatedFunction, getControllers.device.device);
router.get('/method-obtained', isAuthenticatedFunction, getControllers.methodObtained.methodObtained);
router.get('/invalid', isAuthenticatedFunction, getControllers.invalid.invalid);
router.get(['/upload-paper', '/upload-sms', '/upload-email'], isAuthenticatedFunction, getControllers.takePhoto.takePhotoPage);
router.get('/nino', isAuthenticatedFunction, getControllers.nino.ninoPage);
router.get('/address', isAuthenticatedFunction, getControllers.address.addressPage);
router.get('/change-number', isAuthenticatedFunction, getControllers.textMessage.textMessagePage);
router.get('/text-message', isAuthenticatedFunction, getControllers.textMessage.textMessagePage);
router.get('/complete', isAuthenticatedFunction, getControllers.complete.completePage);
router.get('/check-your-answers', isAuthenticatedFunction, getControllers.checkYourAnswers.checkYourAnswersPage);

// Help pages for photo upload
router.get('/help-for-photo-step-1', isAuthenticatedFunction, getControllers.helpForPhoto.helpForPhotoStep1Page);
router.get('/help-for-photo-step-2', isAuthenticatedFunction, getControllers.helpForPhoto.helpForPhotoStep2Page);
router.get('/help-for-photo-step-3', isAuthenticatedFunction, getControllers.helpForPhoto.helpForPhotoStep3Page);
router.get('/help-for-photo-step-4', isAuthenticatedFunction, getControllers.helpForPhoto.helpForPhotoStep4Page);
router.get('/help-for-photo-step-5', isAuthenticatedFunction, getControllers.helpForPhoto.helpForPhotoStep5Page);

// Accessibility Tests GET only

if (config.util.getEnv('NODE_ENV') === 'test') {
    router.get('/cookie-agree/:id', functions.legal.hasViewedCookieMsg);
    router.get('/cookies-table/:id', getControllers.cookiesTable.cookiesTablePage);

    // Fitnote Pages
    router.get('/take-a-photo/:id', isAuthenticatedFunction, getControllers.takePhoto.takePhotoPage);
    router.get('/nino/:id', isAuthenticatedFunction, getControllers.nino.ninoPage);
    router.get('/address/:id', isAuthenticatedFunction, getControllers.address.addressPage);
    router.get('/text-message/:id', isAuthenticatedFunction, getControllers.textMessage.textMessagePage);
    router.get('/complete/:id', isAuthenticatedFunction, getControllers.complete.completePage);
}

// Post Controllers
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/identify', postControllers.identify.identify);
router.post('/method-obtained', postControllers.methodObtained.methodObtained);
router.post('/device', postControllers.device.device);
router.post('/update-cookie-settings', functions.cookieSettings.updateCookieSettings);
router.post('/send-photo', postControllers.photo.sendPhoto);
router.post('/send-nino', postControllers.nino.sendNino);
router.post('/send-text-message', postControllers.textMessage.sendTextMessageConfirmation);
router.post('/send-address', postControllers.address.sendAddress);
router.post('/submit-declaration', postControllers.acceptProcess.submitDeclaration);
router.post('/feedback', postControllers.feedback.sendFeedback);
router.post('/check-your-answers', postControllers.checkYourAnswers.acceptAndSend);

// Endpoints
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/healthcheck', middlewares.healthcheck.healthCheck);

// ERRORS (must be defined after all routes)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/422', getControllers.unprocessableEntity.photoQualityError);
router.get('/422-desktop', getControllers.desktopUnprocessableEntity.desktopPhotoQualityError);
router.get('/session-timeout', getControllers.timeout.sessionTimeout);

// Catch all unknown routes and redirect to 404 page
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.use('/*', catchAll);

// NOTHING AFTER THIS
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = router;
