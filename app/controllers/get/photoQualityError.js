function photoQualityError(req, res) {
    if (config.nodeEnvironment !== 'test') {
        logger.error('422');
        res.status(422);
    }

    res.render('errors/422', {
        title : '422 : Photo quality error',
        sessionId : req.cookies.sessionId,
        version : config.version,
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'errors/422',
        timeStamp : Date.now()
    });
}

module.exports.photoQualityError = photoQualityError;
