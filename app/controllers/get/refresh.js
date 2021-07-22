var request = require('request');
const sessionExpiry = require('../../functions/refreshSessionExpiryTime.js');
var logger = require('../../functions/bunyan');
var logType = logger.child({widget : 'session expiry refresh'});
const config = require('config');

function refresh(req, res) {
    var options = {
        url : config.get('api.url') + '/extendSession?sessionId=' + req.cookies.sessionId,
        method : 'GET',
        json : true
    };

    function callback(err, response) {
        if (!err) {
            logType.info('Response received: ' + response.statusCode);
            if (response.statusCode === 200) {
                sessionExpiry.refreshTime(res, logType);
                res.status(200).json({status : 200, message : 'OK'});
            } else {
                logType.error('Error extending backend session expiry time - missing sessionId');
                res.status(500).render('errors/500');
            }
        } else {
            logType.error('Error accessing /extendSession endpoint' + err);
            res.status(500).render('errors/500');
        }
    }

    request(options, callback);
}

module.exports.refresh = refresh;
