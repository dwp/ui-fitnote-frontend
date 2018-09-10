function refreshTime(res, logType) {
    let expires = new Date(Date.now() + config.sessionExpiryPeriod);
    res.cookie('exp', expires.toUTCString(), {httpOnly : true, secure : true, sameSite : true, expires : 0});
    logType.info('Session timeout refreshed');
    return expires;
}

module.exports.refreshTime = refreshTime;