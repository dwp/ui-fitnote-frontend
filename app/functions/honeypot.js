import logger from './bunyan.js';

export default function honeypot(field, message) {
  if (field) {
    logger.info(message);
    return false;
  }
  return true;
}
