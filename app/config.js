/* eslint-disable */
var serviceCheck = require(appRootDirectory + '/app/functions/checkServer');
var env = process && process.env || {};
var settings;
var service;
var nodeEnvironment = env.NODE_ENV || 'prod';
var config = require(appRootDirectory + '/app/configs/' + nodeEnvironment + '.json');
var json = require('../package.json');

service = {
    provider : 'Secure Comms',
    name : 'Send your fit note',
    version : json.version
};

settings = {
    service : service,
    config : config
};

nodeEnvironment.toLowerCase();
serviceCheck.apiCheck(settings.config.api.port, settings.config.api.hostname, settings.config.api.protocol);

// Set the config object to the above settings, but respect run-time configurations from the environment variables
module.exports = {
    serviceProvider : settings.service.provider,
    serviceName : settings.service.name,
    nodeEnvironment : nodeEnvironment,
    version : settings.service.version,
    logsLocation : settings.config.service.logs,
    loggerName : settings.config.logger ? settings.config.logger.tag : 'fitnote',
    loggerHost : settings.config.logger ? settings.config.logger.host : '',
    loggerPort : settings.config.logger ? settings.config.logger.port : '',
    servicePort : settings.config.service.port,
    serviceKey :  settings.config.service.key,
    serviceCert : settings.config.service.cert,
    serviceCaInter : settings.config.service.ca.intermediate,
    serviceCaRoot : settings.config.service.ca.root,
    minFileSize : settings.config.service.minFileSize,
    apiURL : settings.config.api.protocol + settings.config.api.hostname + ':' + settings.config.api.port,
    apiHost : settings.config.api.hostname,
    apiPort : settings.config.api.port,
    authURL : settings.config.auth.protocol + settings.config.auth.hostname + ':' + settings.config.auth.port,
    authHost : settings.config.auth.hostname,
    authPort : settings.config.auth.port,
    authKey :  settings.config.auth.key,
    authCert : settings.config.auth.cert,
    authCaInter : settings.config.auth.ca.intermediate,
    authCaRoot : settings.config.auth.ca.root,
    notifyApiKey : settings.config.notify ? settings.config.notify.api_key : 'api_key',
    feedbackMailto : settings.config.notify ? settings.config.notify.mailto : '',
    notifyProxy: settings.config.notify ? settings.config.notify.proxy : null,
};
