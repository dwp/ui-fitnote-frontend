import sendIt from './submitDeclaration.js';

function acceptAndSend(req, res) {
  sendIt(req, res);
}

export default acceptAndSend;
