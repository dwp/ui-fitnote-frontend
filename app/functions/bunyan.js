var bunyan = require('bunyan');
var bsyslog = require('bunyan-syslog-udp');
var config = require(appRootDirectory + '/app/config.js');
var logger;
var streamsContent;

if (config.nodeEnvironment !== 'test') {
    if (config.loggerHost && config.loggerPort && config.loggerName) {
        streamsContent =  [{
            type : 'raw',
            level : 'debug',
            stream : bsyslog.createBunyanStream({
                name : config.loggerName,
                host : config.loggerHost,
                port : config.loggerPort,
                facility : 'local0'
            })
        }];
    } else {
        streamsContent =  [{
            stream : process.stdout,
            level : 'debug'
        }];
    }
} else {
    streamsContent =  [];
}

logger = bunyan.createLogger({
    name : config.loggerName,
    serializers : {
        err : bunyan.stdSerializers.err
    },
    streams : streamsContent
});

module.exports = logger;
