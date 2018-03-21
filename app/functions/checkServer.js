var net = require('net');

exports.apiCheck = function apiCheck(portNumber, ipaddress, protocol) {
    var client;
    var url = protocol + ipaddress + ':' + portNumber;

    function apiConnected() {
        logger.info('API Connected: ' + url);
    }

    function apiFail(err) {
        logger.error('API Error : ' + err.message);
    }

    client = net.connect(portNumber, ipaddress, apiConnected);
    client.on('error', apiFail);
};
