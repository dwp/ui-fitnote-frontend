import bunyan from 'bunyan';
import bsyslog from 'bunyan-syslog-udp';
import config from 'config';

// eslint-disable-next-line import/no-mutable-exports
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

export default logger;
