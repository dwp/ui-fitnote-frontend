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
var fs = require('fs');
var app = require('../app/app.js');
var notifyValimate = require('valimate-notifier');
var credentials;
var httpsServer;
const config = require('config');

// Start server, on the port configured in the var above. Start https server, unless running tests, then use http.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if (config.get('service.listenonhttp') === 'true') {
    app.listen(
        config.get('service.port'), function goBrowserSync() {
            logger.info('Provider: ' + config.get('service.provider') +
            ' - Name: ' + config.get('service.name') +
            ' - Version: ' + process.env.npm_package_version +
            ' - Environment: ' + config.util.getEnv('NODE_ENV') +
            ' - Service: localhost:' + config.get('service.port') +
            ' - API: ' + config.get('api.url') +
            ' - Logs: ' + config.logsLocation);
            notifyValimate(true);
        }
    );
} else {
    credentials = {
        key : fs.readFileSync(config.get('service.key')),
        cert : fs.readFileSync(config.get('service.cert')),
        ca : [
            fs.readFileSync(config.get('service.ca.intermediate')),
            fs.readFileSync(config.get('service.ca.root'))
        ],
        requestCert : true,
        rejectUnauthorized : true
    };
    httpsServer = https.createServer(credentials, app);

    httpsServer.listen(config.get('service.port'), function goBrowserSync() {
        logger.info('Provider: ' + config.get('service.provider') +
        '\nName: ' + config.get('service.name') +
        '\nVersion: ' + process.env.npm_package_version +
        '\nEnvironment: ' + config.util.getEnv('NODE_ENV') +
        '\nService: localhost:' + config.get('service.port') +
        '\nAPI: ' + config.get('api.url') +
        '\nLogs: ' + config.logsLocation);
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
