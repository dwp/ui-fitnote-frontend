const net = require('net');
const config = require('config');
const url = require('url');
const logger = require('./bunyan');

exports.apiCheck = function apiCheck(uri) {
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
};
