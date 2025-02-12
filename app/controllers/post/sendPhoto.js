const rp = require('request-promise-native');
const multer = require('multer');
const config = require('config');
const filesize = require('filesize');

const logger = require('../../functions/bunyan');
const encoder = require('../../functions/base64Encode');
const photoRoute = require('../../functions/getPhotoRoute');
const checkHoneypot = require('../../functions/honeypot');
const hasTimedOut = require('../../functions/timeoutRedirect');
const sessionExpiry = require('../../functions/refreshSessionExpiryTime.js');

function encodeImage(req) {
  if (typeof req.file !== 'undefined') {
    return encoder.convertBase64(req.file.buffer);
  }
  return '';
}

function apiUploadOptions(req, logType) {
  logType.info('Image Encoded');
  const userPhotoEncoded = encodeImage(req);
  return {
    url: `${config.get('api.url')}/photo`,
    method: 'POST',
    json: true,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    agentOptions: {
      keepAlive: true,
    },
    timeout: 240000,
    body: {
      sessionId: req.cookies.sessionId,
      image: userPhotoEncoded,
    },
  };
}

function getFileSize(byteSize) {
  let sizeObject = filesize.filesize(byteSize, { exponent: 2, output: 'object' });
  if (sizeObject.value >= 1) {
    return filesize.filesize(byteSize, { exponent: 2, round: 1 });
  }
  sizeObject = filesize.filesize(byteSize, { exponent: 1, round: 0, output: 'object' });
  if (sizeObject.value >= 1) {
    return filesize.filesize(byteSize, { exponent: 1, round: 0 });
  }
  return filesize.filesize(byteSize, { exponent: 0, round: 0, fullform: true });
}

function errorRoute(req, logType) {
  const { sessionId } = req.cookies;
  const route = photoRoute.getRoute(req);
  let errRoute;
  const fileSize = getFileSize(req.file.size);
  const validImageFileTypes = new RegExp('^image/');
  if ((!validImageFileTypes.test(req.file.mimetype)) && req.file.mimetype !== 'application/pdf') {
    logType.info(`File type (${req.file.mimetype}) is invalid, for sessionId ${sessionId}`);
    errRoute = `/${route}&type=2`;
  }
  if ((req.file.size > config.get('service.maxFileSize'))) {
    logType.info(`File size ${fileSize} is invalid, for sessionId ${sessionId}`);
    errRoute = `/${route}&size=2`;
  }
  if (!errRoute) {
    logType.info(`File type is ${req.file.mimetype}, for sessionId ${sessionId}`);
    logType.info(`File size is ${fileSize}, for sessionId ${sessionId}`);
  }

  return errRoute;
}

function sendPhoto(req, res) {
  const logType = logger.child({ widget: 'photoUploader' });

  const storage = multer.memoryStorage();
  const upload = multer({ storage }).single('userPhoto');

  const route = photoRoute.getRoute(req);

  function handleCriticalFormError(err, msg) {
    logType.fatal({ err }, msg);
    return res.status(500).redirect('/500');
  }

  function requestUploadCallback(err, counter) {
    const errRoute = errorRoute(req, logType);
    let count = counter;
    if (typeof req.file !== 'undefined' && errRoute) {
      res.redirect(errRoute);
      return;
    }

    rp(apiUploadOptions(req, logType))
      .then((response) => {
        sessionExpiry.refreshTime(res, logType);
        if (response.sessionId != null) {
          logType.info(`API call attempts successful on: ${count} ${count > 0 ? 'retry' : ''}`);
          logType.info('Submitted image successfully');
          res.redirect('/photo-audit');
        }
      })
      .catch(() => {
        if (count > 4) {
          logType.error('Failed 5 times');
          handleCriticalFormError(err, 'API not responding');
        } else {
          count += 1;
          setTimeout(() => {
            requestUploadCallback(err, count);
          }, count * 2 * 1000);
        }
      });
  }

  function uploadCallback(err) {
    const { file } = req;
    if (!file) {
      logType.debug({ err }, 'No photo submitted');
      res.redirect(`/${route}&error=noPhoto`);
      return;
    }

    if (err) {
      res.render(`${route}`, { error: { message: req.i18nTranslator.t('upload:connection') } });
      logType.error({ err }, 'Problem uploading image');
    } else if (typeof req.cookies.sessionId !== 'undefined') {
      const fakeImageNameRaw = req.body.imageNameField;
      const passedHoneypot = checkHoneypot.honeypot(fakeImageNameRaw, 'BOT: honeypot detected a bot, Take a Photo Page, ImageName Field');
      logType.info(`Passed Honeypot ${passedHoneypot}`);

      if (!passedHoneypot) {
        logType.info('BOT detected. Doing fake send');
        res.redirect('/nino'); // don't post the request just go to the next page.
      } else {
        requestUploadCallback(err, 0);
      }
    } else {
      const redirectUrl = hasTimedOut.redirectTimeout('no valid session');
      res.redirect(redirectUrl);
    }
  }

  upload(req, res, uploadCallback);
}

module.exports.sendPhoto = sendPhoto;
