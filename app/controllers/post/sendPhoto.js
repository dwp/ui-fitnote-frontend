const rp = require('request-promise-native');
const multer = require('multer');
const config = require('config');

const logger = require('../../functions/bunyan');
const encoder = require('../../functions/base64Encode');
const checkHoneypot = require('../../functions/honeypot');
const hasTimedOut = require('../../functions/timeoutRedirect');
const sessionExpiry = require('../../functions/refreshSessionExpiryTime.js');

function getRoute(req) {
  let route;
  if (typeof req.cookies.route !== 'undefined') {
    if (req.cookies.route === 'upload-digital') {
      route = 'upload?ref=digital';
    } else if (req.cookies.route === 'upload-paper') {
      route = 'upload?ref=paper';
    } else {
      route = req.cookies.route;
    }
  } else {
    route = '';
  }

  return route;
}

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

function errorRoute(req, logType) {
  logType.info(`File type is ${req.file.mimetype}`);
  logType.info(`File size is ${req.file.size}`);
  const route = getRoute(req);
  let errRoute;
  const validImageFileTypes = new RegExp('^image/');
  if ((!validImageFileTypes.test(req.file.mimetype)) && req.file.mimetype !== 'application/pdf') {
    logType.info(`File type (${req.file.mimetype}) is invalid`);
    errRoute = `/${route}&type=1`;
  }
  if (req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif') {
    logType.info(`File type (${req.file.mimetype}) is invalid as it is heic or heif`);
    errRoute = `/${route}&type=2`;
  }
  if ((req.file.size > config.get('service.maxFileSize'))) {
    logType.info(`File size (${req.file.size}) is invalid`);
    errRoute = `/${route}&size=2`;
  }

  return errRoute;
}

function sendPhoto(req, res) {
  const logType = logger.child({ widget: 'photoUploader' });

  const storage = multer.memoryStorage();
  const upload = multer({ storage }).single('userPhoto');

  const route = getRoute(req);

  function handleCriticalFormError(err, msg) {
    logType.fatal({ err }, msg);
    return res.status(500).render('errors/500');
  }

  // infinite request to image status api call until fitnoteStatus is updated
  function requestRetry(options) {
    // Return a request
    return rp(options).then((imgResponse) => {
      const { fitnoteStatus } = imgResponse;
      // check if successful. If so, return the response transformed to json
      if (fitnoteStatus === 'UPLOADED') {
        // return a call to requestRetry
        return requestRetry(options);
      }
      logType.info(`body ${fitnoteStatus}`);
      if (config.nodeEnvironment !== 'test') {
        switch (fitnoteStatus) {
          case 'SUCCEEDED':
            return res.redirect('/nino');
          case 'FAILED_IMG_OCR':
          case 'FAILED_IMG_OCR_PARTIAL':
            return res.redirect(`/${route}&error=ocrFailed`);
          case 'FAILED_IMG_SIZE':
            return res.redirect('/422');
          case 'FAILED_ERROR':
            return res.redirect(`/${route}&error=invalidPhoto`);
          default:
            return res.redirect(`/${route}`);
        }
      } else {
        return res.redirect(`/${route}`);
      }
    })
      .catch((imgErr) => {
        logType.error('Error from imageStatus api call is : ', imgErr);
        res.redirect(`/${route}&error=serviceFailed`);
      });
  }

  function requestUploadCallback(err) {
    const errRoute = errorRoute(req, logType);
    if (typeof req.file !== 'undefined' && errRoute) {
      res.redirect(errRoute);
      return;
    }

    rp(apiUploadOptions(req, logType))
      .then(() => {
        sessionExpiry.refreshTime(res, logType);
        const imgStatusOptions = {
          url: `${config.get('api.url')}/imagestatus?sessionId=${req.cookies.sessionId}`,
          method: 'GET',
          json: true,
        };

        requestRetry(imgStatusOptions);
      })
      .catch(() => {
        handleCriticalFormError(err, 'API not responding');
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
        requestUploadCallback(err);
      }
    } else {
      const redirectUrl = hasTimedOut.redirectTimeout('no valid session');
      res.redirect(redirectUrl);
    }
  }

  upload(req, res, uploadCallback);
}

module.exports.sendPhoto = sendPhoto;
