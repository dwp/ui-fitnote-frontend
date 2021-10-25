const config = require('config');
const logger = require('../functions/bunyan');

// Setup Timeout dialog
function TimeoutDialog(req, res, next) {
  const staticPatt = /^\/(assets|stylesheets|images|javascript)/gi;
  if (staticPatt.test(req.path)) {
    logger.debug('Skipping static path');
    next();
    return;
  }
  const sessionTtl = config.get('sessionInfo.expiryPeriod');
  const timeoutDialogCountdown = config.get('sessionInfo.timeoutCountdown');

  res.locals.timeoutDialog = {
    keepAliveUrl: '/refresh-session',
    signOutUrl: 'https://www.gov.uk/send-fit-note',
    timeoutUrl: '/session-timeout',
    countdown: timeoutDialogCountdown / 1000,
    timeout: sessionTtl / 1000,
  };
  next();
}

module.exports = TimeoutDialog;
