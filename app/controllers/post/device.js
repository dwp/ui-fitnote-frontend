var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');

function devicePage(req, res) {
    var deviceRaw = req.body.device;
    var deviceValid = (deviceRaw === 'desktop' || deviceRaw === 'phone');
    var redirectUrl;
    var route;

    if (typeof req.cookies.sessionId !== 'undefined') {
        if (deviceValid) {
            route = (req.body.device === 'desktop') ? 'upload' : 'take';
            res.cookie('route', route, {httpOnly : true, secure : true, sameSite : true, expires : 0});
            res.redirect(`/${route}-a-photo`);
        } else {
            res.redirect('/device?device=0');
        }
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.device = devicePage;
