/*
Node Server running Express and Nunjucks

Dependancies
--
Node: https://nodejs.org/en/
Express: http://expressjs.com
Nunjucks: https://mozilla.github.io/nunjucks/

Architecture
--
Node acts as the server.
Express facilitates API and middleware for the web application.
Nunjucks is the JavaScript templating engine by Mozilla.
*/

var https = require('https');
var app = require('../app/app.js');
var fs = require('fs');
var notifyValimate = require('valimate-notifier');
var credentials;
var httpsServer;

// HTTPS Certs
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
credentials = {
    key : fs.readFileSync(config.serviceKey),
    cert : fs.readFileSync(config.serviceCert),
    ca : [
        fs.readFileSync(config.serviceCaInter),
        fs.readFileSync(config.serviceCaRoot)
    ],
    requestCert : true,
    rejectUnauthorized : true
};

// Start server, on the port configured in the var above. Start https server, unless running tests, then use http.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if (config.nodeEnvironment !== 'test') {
    httpsServer = https.createServer(credentials, app).listen(config.servicePort);

    httpsServer.listen(config.servicePort, function goBrowserSync() {
        logger.info('Provider: ' + config.serviceProvider +
         '\nName: ' + config.serviceName +
         '\nVersion: ' + config.version +
         '\nEnvironment: ' + config.nodeEnvironment +
         '\nService: localhost:' + config.servicePort +
         '\nAPI: ' + config.apiURL +
         '\nAuth: ' + config.authURL +
         '\nLogs: ' + config.logsLocation);
    });
} else {
    app.listen(config.servicePort, function goBrowserSync() {
        notifyValimate(true);
    });
}

// Gracefully handle node server kill via CTRL+C
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
process.on('SIGINT', function killTheThings() {
    process.kill(process.pid, 'SIGTERM');
    /*eslint no-process-exit: "off"*/
    process.exit();
});

exports.closeServer = function closeServer() {
    process.exit();
};
