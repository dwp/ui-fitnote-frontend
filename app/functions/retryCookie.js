import config from 'config';
import logger from './bunyan.js';

export default function retryCookie(req, res) {
  logger.info('retry cookie generated');
  res.cookie('retry', '1', {
    httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
  });
  return true;
}
