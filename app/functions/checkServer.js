var net = require('net');
const config = require('config');

exports.apiCheck = function apiCheck(uri) {
    var client;
    function apiConnected() {
        if (config.util.getEnv('NODE_ENV') !== 'test') {
            logger.info('API Connected: ' + uri);
        }
    }

    function apiFail(err) {
        if (config.util.getEnv('NODE_ENV') !== 'test') {
            logger.error('API Error : ' + err.message);
        }
    }
    const url = require('url');
    const myURL = url.parse(uri, true);

    client = net.connect(myURL.port, myURL.hostname, apiConnected);
    client.on('error', apiFail);
};
