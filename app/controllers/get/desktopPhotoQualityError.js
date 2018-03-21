function desktopPhotoQualityError(req, res) {
    if (config.nodeEnvironment !== 'test') {
        logger.error('422-desktop');
        res.status(422);
    }

    res.render('errors/422-desktop', {
        title : '422 : Photo quality error',
        sessionId : req.cookies.sessionId,
        version : config.version,
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'errors/422-desktop',
        timeStamp : Date.now()
    });
}

module.exports.desktopPhotoQualityError = desktopPhotoQualityError;
