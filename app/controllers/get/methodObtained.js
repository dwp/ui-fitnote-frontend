const config = require('config');
const getLanguage = require(appRootDirectory + '/app/functions/getLanguage');

function methodObtainedPage(req, res) {
    const validationErrors = JSON.stringify(require('../../locales/' + getLanguage(req.language) + '/errors.json'));
    var previousPageCYA = 0;

    if (req.query.hasOwnProperty('ref')) {
        if (req.query.ref === 'upload-paper') {
            previousPageCYA = 1;
        }
        if (req.query.ref === 'upload-sms') {
            previousPageCYA = 2;
        }
        if (req.query.ref === 'upload-email') {
            previousPageCYA = 3;
        }
    }
    res.render('method-obtained', {
        sessionId : req.cookies.sessionId,
        version : process.env.npm_package_version,
        timeStamp : Date.now(),
        previousPageCYA : previousPageCYA,
        environment : config.util.getEnv('NODE_ENV'),
        validationErrors : validationErrors
    });
}

module.exports.methodObtained = methodObtainedPage;
