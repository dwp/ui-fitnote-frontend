import net from 'net';
import config from 'config';
import url from 'url';
import logger from './bunyan.js';

export default function apiCheck(uri) {
  function apiConnected() {
    if (config.util.getEnv('NODE_ENV') !== 'test') {
      logger.info(`API Connected: ${uri}`);
    }
  }

  function apiFail(err) {
    if (config.util.getEnv('NODE_ENV') !== 'test') {
      logger.error(`API Error : ${err.message}`);
    }
  }
  const myURL = url.parse(uri, true);

  const client = net.connect(myURL.port, myURL.hostname, apiConnected);
  client.on('error', apiFail);
}
