var express = require('express');
var router = new express.Router();
var functionPath = appRootDirectory + '/app/functions/';
var getControllerPath = appRootDirectory + '/app/controllers/get/';
var postControllerPath = appRootDirectory + '/app/controllers/post/';

var getControllers = {
    home  : require(getControllerPath + 'index'),
    device  : require(getControllerPath + 'device'),
    takePhoto  : require(getControllerPath + 'takePhoto'),
    photoAudit  : require(getControllerPath + 'photoAudit'),
    nino  : require(getControllerPath + 'nino'),
    address  : require(getControllerPath + 'address'),
    textMessage  : require(getControllerPath + 'textMessage'),
    complete  : require(getControllerPath + 'complete'),
    feedback  : require(getControllerPath + 'feedback'),

    cookies : require(getControllerPath + 'cookies'),
    cookiesTable : require(getControllerPath + 'cookiesTable'),
    unprocessableEntity : require(getControllerPath + 'photoQualityError'),
    desktopUnprocessableEntity : require(getControllerPath + 'desktopPhotoQualityError'),
    timeout : require(getControllerPath + 'sessionTimeout')
};

var postControllers = {
    index : require(postControllerPath + 'index'),
    device  : require(postControllerPath + 'device'),
    photo : require(postControllerPath + 'sendPhoto'),
    nino : require(postControllerPath + 'sendNino'),
    address  : require(postControllerPath + 'sendAddress'),
    textMessage  : require(postControllerPath + 'sendTextMessage'),
    acceptProcess  : require(postControllerPath + 'submitDeclaration'),
    feedback  : require(postControllerPath + 'sendFeedback'),
    session  : require(postControllerPath + 'refresh')
};

var functions = {
    authentication  : require(functionPath + 'isAuthenticated'),
    legal  : require(functionPath + 'hasViewedCookieMessage'),
    session  : require(functionPath + 'createSessionId'),
    retry  : require(functionPath + 'retryCookie')
};

var isAuthenticatedFunction = functions.authentication.isAuthenticated;

// Controller Functions
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function catchSlash(req, res) {
    res.redirect('/index');
}

function catchAll(req, res) {
    res.status(404).render('errors/404');
}

// Get Controllers
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/', catchSlash);
router.get('/cookie-agree/', functions.legal.hasViewedCookieMsg);
router.get('/cookies', getControllers.cookies.cookiesPage);
router.get('/cookies-table', getControllers.cookiesTable.cookiesTablePage);
router.get('/feedback', getControllers.feedback.feedbackPage);
router.get('/thank-you', getControllers.feedback.thankYouPage);

// Fitnote Pages
router.get('/index', getControllers.home.indexPage);
router.get('/device', isAuthenticatedFunction, getControllers.device.device);
router.get(['/take-a-photo', '/upload-a-photo'], isAuthenticatedFunction, getControllers.takePhoto.takePhotoPage);
router.get('/photo-audit', isAuthenticatedFunction, getControllers.photoAudit.photoAuditPage);
router.get('/nino', isAuthenticatedFunction, getControllers.nino.ninoPage);
router.get('/address', isAuthenticatedFunction, getControllers.address.addressPage);
router.get('/text-message', isAuthenticatedFunction, getControllers.textMessage.textMessagePage);
router.get('/complete', isAuthenticatedFunction, getControllers.complete.completePage);

// routes for marketing campaign
router.get('/start', getControllers.home.indexPage);
router.get('/go', getControllers.home.indexPage);
router.get('/begin', getControllers.home.indexPage);

// Accessibility Tests GET only
if (config.nodeEnvironment === 'test') {
    router.get('/cookie-agree/:id', functions.legal.hasViewedCookieMsg);
    router.get('/cookies/:id', getControllers.cookies.cookiesPage);
    router.get('/cookies-table/:id', getControllers.cookiesTable.cookiesTablePage);

    // Fitnote Pages
    router.get('/index/:id', isAuthenticatedFunction, getControllers.home.indexPage);
    router.get('/take-a-photo/:id', isAuthenticatedFunction, getControllers.takePhoto.takePhotoPage);
    router.get('/photo-audit/:id', isAuthenticatedFunction, getControllers.photoAudit.photoAuditPage);
    router.get('/nino/:id', isAuthenticatedFunction, getControllers.nino.ninoPage);
    router.get('/address/:id', isAuthenticatedFunction, getControllers.address.addressPage);
    router.get('/text-message/:id', isAuthenticatedFunction, getControllers.textMessage.textMessagePage);
    router.get('/complete/:id', isAuthenticatedFunction, getControllers.complete.completePage);
}

// Post Controllers
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/index', postControllers.index.index);
router.post('/device', postControllers.device.device);
router.post('/send-photo', postControllers.photo.photoUploader);
router.post('/send-nino', postControllers.nino.sendNino);
router.post('/send-text-message', postControllers.textMessage.sendTextMessageConfirmation);
router.post('/send-address', postControllers.address.sendAddress);
router.post('/submit-declaration', postControllers.acceptProcess.submitDeclaration);
router.post('/feedback', postControllers.feedback.sendFeedback);
router.post('/refresh-session', postControllers.session.refresh);

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
