var sendIt = require(appRootDirectory + '/app/controllers/post/submitDeclaration');

function acceptAndSend(req, res) {
    sendIt.submitDeclaration(req, res);
}

module.exports.acceptAndSend = acceptAndSend;
