import logger from './bunyan.js';

export default function timeout(msg) {
  logger.info(msg);
  return '/session-timeout';
}
