import config from 'config';

function getFileError(req) {
  let fileError = false;
  if (req.query.type === '2' || req.query.size === '2') {
    fileError = true;
  }
  return fileError;
}

function getTypeError(req) {
  let typeError = false;
  if (req.query.type === '2') {
    typeError = true;
  }

  return typeError;
}

function getMaxSizeError(req) {
  let maxSizeError = false;
  if (req.query.size === '2') {
    maxSizeError = true;
  }

  return maxSizeError;
}

function getPhotoTypeError(req) {
  let photoTypeError = {};
  const maxSizeError = getMaxSizeError(req);

  if (req.query.type === '2') {
    photoTypeError = {
      message: req.i18nTranslator.t('errors:invalidFileType'),
      field: 'submitButton',
    };
  }

  if (maxSizeError) {
    photoTypeError = {
      message: req.i18nTranslator.t('upload:tooBig'),
      field: 'submitButton',
    };
  }

  return photoTypeError;
}

function getPhotoError(req, res) {
  let photoError;
  const int = parseInt(req.cookies.retry, 2) + 1;

  switch (req.query.error) {
    case 'serviceFailed':
      photoError = {
        message: req.i18nTranslator.t('upload:serviceFail'),
        field: 'submitButton',
      };
      break;
    case 'ocrFailed':
      res.cookie('retry', int, {
        httpOnly: true,
        secure: config.get('cookieOptions.secure'),
        sameSite: true,
        expires: 0,
      });
      photoError = {
        retry: req.cookies.retry,
        message: req.i18nTranslator.t('upload:failed-ocr'),
        field: 'submitButton',
      };
      break;
    case 'maxReplay':
      photoError = {
        message: req.i18nTranslator.t('upload:maxReplay'),
        field: 'submitButton',
      };
      break;
    case 'password':
      photoError = {
        message: req.i18nTranslator.t('upload:password'),
        field: 'submitButton',
      };
      break;
    default:
      photoError = {};
  }

  return photoError;
}

function getErrorMessage(req, res) {
  let errorMessage;
  const fileError = getFileError(req);
  const photoError = getPhotoError(req, res);
  const photoTypeError = getPhotoTypeError(req);
  if ((req.query.error !== 'ocrFailed') && (req.query.error !== 'serviceFailed') && (req.query.error !== 'maxReplay') && (req.query.error !== 'password') && !fileError) {
    errorMessage = '';
  } else if (req.query.error === 'ocrFailed') {
    errorMessage = {
      photoOCR: { ...photoError, ...photoTypeError },
    };
  } else {
    errorMessage = {
      photo: { ...photoError, ...photoTypeError },
    };
  }

  return errorMessage;
}

function takePhotoPage(req, res) {
  let route;
  let previousPageCYA;

  if (typeof req.cookies.route !== 'undefined') {
    route = req.cookies.route;
  }

  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');
  if (hasRefProperty) {
    previousPageCYA = req.query.ref === 'digital' ? 1 : 0;
  }

  const fileError = getFileError(req);
  const typeError = getTypeError(req);
  const maxSizeError = getMaxSizeError(req);
  const errors = getErrorMessage(req, res);

  res.render('upload', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    environment: config.util.getEnv('NODE_ENV'),
    timeStamp: Date.now(),
    previousPageCYA,
    route,
    errors,
    fileError,
    typeError,
    maxSizeError,
    serviceFail: req.query.error === 'serviceFailed',
    invalidPhoto: req.query.error === 'invalidPhoto',
    maxReplay: req.query.error === 'maxReplay',
  });
}

export default takePhotoPage;
