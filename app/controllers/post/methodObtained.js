const config = require('config');
const hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');

function methodObtainedPage(req, res) {
    const methodObtained = req.body.methodObtained;
    const isValid = methodObtained === 'paper' || methodObtained === 'sms' || methodObtained === 'email';
    let route, redirectUrl;

    if (typeof req.cookies.sessionId !== 'undefined') {
        if (isValid) {
            route = `upload-${methodObtained}`;
            res.cookie('route', route, {httpOnly : true, secure : config.get('cookieOptions.secure'), sameSite : true, expires : 0});
            res.redirect(`/${route}`);  
        } else {
            res.redirect('/method-obtained');
        }
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.methodObtained = methodObtainedPage;
