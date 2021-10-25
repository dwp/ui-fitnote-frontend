const bunyan = require('bunyan');
const bsyslog = require('bunyan-syslog-udp');
const config = require('config');

let logger = config.get('logger');
let streamsContent;

if (config.nodeEnvironment !== 'test') {
  if (logger.host && logger.port && logger.name) {
    streamsContent = [{
      type: 'raw',
      level: 'debug',
      stream: bsyslog.createBunyanStream({
        name: logger.tag,
        host: logger.host,
        port: logger.port,
        facility: 'local0',
      }),
    }];
  } else {
    streamsContent = [{
      stream: process.stdout,
      level: 'debug',
    }];
  }
} else {
  streamsContent = [];
}

logger = bunyan.createLogger({
  name: logger.tag,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  streams: streamsContent,
});

module.exports = logger;
