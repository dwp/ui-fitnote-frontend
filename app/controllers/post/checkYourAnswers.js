const sendIt = require('./submitDeclaration');

function acceptAndSend(req, res) {
  sendIt.submitDeclaration(req, res);
}

module.exports.acceptAndSend = acceptAndSend;
