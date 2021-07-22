const config = require('config');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');

function devicePage(req, res) {
    var deviceRaw = req.body.device;
    var deviceValid = (deviceRaw === 'desktop' || deviceRaw === 'phone');
    var route;
    var redirectUrl;
    logger.info('Session ID ' + req.cookies.sessionId);
    if (typeof req.cookies.sessionId !== 'undefined') {
        if (deviceValid) {
            route = (req.body.device === 'desktop') ? 'upload' : 'take';
            res.cookie('route', route, {
                httpOnly : true,
                secure : config.get('cookieOptions.secure') === 'true',
                sameSite : true,
                expires : 0
            });
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
