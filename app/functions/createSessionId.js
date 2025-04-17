import { sync as uid } from 'uid-safe';
import config from 'config';
import getLanguage from './getLanguage.js';
import logger from './bunyan.js';

function generateId() {
  return uid(24);
}

export default function createSessionId(req, res) {
  const id = generateId();
  const expires = new Date(Date.now() + config.get('sessionInfo.expiryPeriod'));
  logger.info('Session ID and Expiry generated');
  res.cookie('sessionId', id, {
    httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
  });
  res.cookie('exp', expires.toUTCString(), {
    httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
  });

  res.locals.exp = expires.toUTCString();
  res.locals.lang = getLanguage(req.language);

  return id;
}
