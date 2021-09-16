const config = require('config');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');

function identifyPage(req, res) {
    var identify = req.body.identify;
    var redirectUrl;
    var route;
    logger.info('Cookies: ' + req.cookies.sessionId);

    if (typeof req.cookies.sessionId !== 'undefined') {
        if (identify === 'Yes' || identify === 'No') {
            route = identify === 'Yes' ? 'method-obtained' : 'invalid';
            res.cookie('route', route, {httpOnly : true, secure : config.get('cookieOptions.secure'), sameSite : true, expires : 0});
            res.redirect(`/${route}`);
        } else {
            res.redirect('/identify');
        }
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.identify = identifyPage;
