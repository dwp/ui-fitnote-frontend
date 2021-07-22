const config = require('config');

function devicePage(req, res) {
    var errorMessage;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));

    if (req.query.device === '0') {
        errorMessage = {
            device : {
                message : req.i18nTranslator.t('errors:device.missing'),
                field : 'radioPhone'
            }
        };
    }

    logger.info(req.cookies.sessionId);

    res.render('device', {
        sessionId : req.cookies.sessionId,
        version : process.env.npm_package_version,
        timeStamp : Date.now(),
        environment : config.util.getEnv('NODE_ENV'),
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

module.exports.device = devicePage;
