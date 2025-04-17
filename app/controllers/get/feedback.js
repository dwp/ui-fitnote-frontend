import config from 'config';
import getLanguage from '../../functions/getLanguage.js';
import enErrors from '../../locales/en/errors.json' with { type: 'json' };
import cyErrors from '../../locales/cy/errors.json' with { type: 'json' };

function getErrorMessage(req) {
  let ratingError;
  let improvementsError;
  let nameError;
  let phoneError;
  let errorMessage;

  if (req.query.rating === '0') {
    ratingError = {
      message: req.i18nTranslator.t('errors:feedback.required'),
      field: 'vSatisfied',
    };
  }
  if (req.query.improvements === '0') {
    improvementsError = {
      message: req.i18nTranslator.t('errors:feedback.maxlength'),
      field: 'improvementsID',
    };
  }
  if (req.query.name === '0') {
    nameError = {
      message: req.i18nTranslator.t('errors:feedback.name'),
      field: 'nameID',
    };
  }
  if (req.query.phone === '0') {
    phoneError = {
      message: req.i18nTranslator.t('errors:feedback.phone'),
      field: 'phoneID',
    };
  }
  if ((req.query.rating !== '0') && (req.query.improvements !== '0')
        && (req.query.name !== '0') && (req.query.phone !== '0')) {
    errorMessage = '';
  } else {
    errorMessage = {
      rating: ratingError,
      improvements: improvementsError,
      name: nameError,
      phone: phoneError,
    };
  }

  return errorMessage;
}

export function feedbackPage(req, res) {
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  let previousPage;

  const errors = getErrorMessage(req);
  if (req.headers.referer) {
    previousPage = req.headers.referer.substring(req.headers.referer.lastIndexOf('/'));
  } else if (req.cookies.feedback) {
    previousPage = req.cookies.feedback;
  } else {
    previousPage = '';
  }

  res.cookie('feedback',
    previousPage,
    {
      httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
    });

  res.render('feedback', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
    errors,
    validationErrors,
  });
}

export function feedbackSentPage(req, res) {
  res.render('feedback-sent', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
    returnUrl: req.query.return,
  });
}
