const config = require('config');
const request = require('request');
const photoRoute = require('../../functions/getPhotoRoute');
const sessionExpiry = require('../../functions/refreshSessionExpiryTime');
const logger = require('../../functions/bunyan');

function photoStatus(req, res) {
  const logType = logger.child({ widget: 'photoStatusChecker' });
  const route = photoRoute.getRoute(req);
  const { sessionId } = req.cookies;
  sessionExpiry.refreshTime(res, logType);
  const options = {
    url: `${config.get('api.url')}/imagestatus?sessionId=${sessionId}`,
    method: 'GET',
    json: true,
  };
  function callback(err, response, body) {
    if (err || response.statusCode !== 200) {
      res.status(200).send(`/${route}&error=serviceFailed`);
    } else {
      logType.info(`Response received: ${response.statusCode}`);
      const { fitnoteStatus } = body;
      // check if successful. If so, return the response transformed to json
      if (fitnoteStatus === 'UPLOADED') {
        res.status(200).send('UPLOADED');
        return;
      }
      logType.info(`body ${fitnoteStatus}, for sessionId ${sessionId}`);
      if (config.nodeEnvironment !== 'test') {
        switch (fitnoteStatus) {
          case 'SUCCEEDED':
            res.status(200).send('/nino');
            break;
          case 'FAILED_IMG_OCR':
          case 'FAILED_IMG_OCR_PARTIAL':
            res.status(200).send(`/${route}&error=ocrFailed`);
            break;
          case 'FAILED_IMG_SIZE':
            res.status(200).send(`/${route}&size=2`);
            break;
          case 'FAILED_IMG_MAX_REPLAY':
            res.status(200).send(`/${route}&error=maxReplay`);
            break;
          case 'FAILED_IMG_PASSWORD':
            res.status(200).send(`/${route}&error=password`);
            break;
          case 'FAILED_ERROR':
          case 'FAILED_IMG_COMPRESS':
          case 'FAILED_IMG_FILE_TYPE':
            res.status(200).send(`/${route}&type=2`);
            break;
          default:
            res.status(200).send(`/${route}`);
            break;
        }
      } else {
        res.status(200).send(`/${route}`);
      }
    }
  }

  request(options, callback);
}

module.exports.photoStatus = photoStatus;
