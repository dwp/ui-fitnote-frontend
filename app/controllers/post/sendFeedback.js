import config from 'config';
import { NotifyClient } from 'notifications-node-client';
import logger from '../../functions/bunyan.js';
import checkHoneypot from '../../functions/honeypot.js';

const notifyProxyHost = config.get('notify.proxyHost') === 'null' ? null : config.get('notify.proxyHost');
const notifyProxyPort = config.get('notify.proxyPort') === 'null' ? null : config.get('notify.proxyPort');

const notifyClient = new NotifyClient(config.get('notify.api_key'));

if (notifyProxyHost && notifyProxyPort) {
  notifyClient.setProxy({
    host: notifyProxyHost,
    port: notifyProxyPort,
  });
}

function validateFormFields(req) {
  const ratingRaw = req.body.rating;
  const improvementsRaw = req.body.improvements;
  const nameRaw = req.body.name;
  const phoneRaw = req.body.phone;

  const ratingValid = !ratingRaw ? '0' : '1';
  const improvementsValid = improvementsRaw.length > 1200 ? '0' : '1';
  const nameValid = nameRaw.length > 1000 ? '0' : '1';
  const phoneValid = phoneRaw.length <= 1000 && (phoneRaw === '' || phoneRaw.replace(/[^0-9]+/g, '').length > 8) ? '1' : '0';

  return {
    ratingValid,
    improvementsValid,
    nameValid,
    phoneValid,
  };
}

function sendFeedback(req, res) {
  const logType = logger.child({ widget: 'postFeedback' });
  const ratingRaw = req.body.rating;
  const improvementsRaw = req.body.improvements;
  const nameRaw = req.body.name;
  const phoneRaw = req.body.phone;
  const fromPage = req.cookies.feedback || '';
  const fakePhoneRaw = req.body.phoneField;
  const passedHoneypot = checkHoneypot(fakePhoneRaw, 'BOT: honeypot detected a bot, Feedback Page, Phone Field');

  const validateForm = validateFormFields(req);
  if (validateForm.ratingValid === '1' && validateForm.improvementsValid === '1' && validateForm.nameValid === '1' && validateForm.phoneValid === '1') {
    if (passedHoneypot) {
      notifyClient
        .sendEmail('6af9c0cd-2b28-4605-8bfd-1b79dc5c6b30', config.get('notify.mailto'), {
          personalisation: {
            rating: ratingRaw,
            improvements: improvementsRaw,
            name: nameRaw,
            phone: phoneRaw,
            page: fromPage,
          },
        })
        .then(() => {
          logType.info('Feedback sent successfully');
          res.clearCookie('feedback');
          res.redirect('/feedback-sent');
        })
        .catch((err) => {
          logType.error(`Error sending feedback via notify: ${err}`);
          res.status(500).redirect('/500');
        });
    } else {
      res.clearCookie('feedback');
      logType.info('BOT detected. Doing fake send');
      res.redirect('/feedback-sent'); // don't post the request just go to the next page.
    }
  } else {
    logType.info('Form Fields Invalid');
    res.redirect(`feedback?rating=${validateForm.ratingValid}&improvements=${validateForm.improvementsValid
    }&name=${validateForm.nameValid}&phone=${validateForm.phoneValid}`);
  }
}

export default sendFeedback;
