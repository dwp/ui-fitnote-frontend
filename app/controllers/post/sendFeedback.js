var logger = require(appRootDirectory + '/app/functions/bunyan');
var checkHoneypot = require(appRootDirectory + '/app/functions/honeypot');
var NotifyClient = require('notifications-node-client').NotifyClient;
var config = require('config');
var notifyClient = new NotifyClient(config.get('notify.api_key'));
notifyClient.setProxy({
    host : config.get('notify.proxyHost'),
    port : config.get('notify.proxyPort')
});

function sendFeedback(req, res) {
    var logType = logger.child({widget : 'postFeedback'});
    var ratingRaw = req.body.rating;
    var improvementsRaw = req.body.improvements;
    var nameRaw = req.body.name;
    var phoneRaw = req.body.phone;
    var fromPage = req.cookies.feedback || '';
    var fakePhoneRaw = req.body.phoneField;
    var passedHoneypot = checkHoneypot.honeypot(fakePhoneRaw, 'BOT: honeypot detected a bot, Feedback Page, Phone Field');
    var postSubmissionRedirect = (fromPage !== '/complete') ? '?' + require('querystring').stringify({
        return : fromPage
    }) : '';

    function ratingValid() {
        return (!ratingRaw) ? '0' : '1';
    }
    function improvementsValid() {
        return (improvementsRaw.length > 1200) ? '0' : '1';
    }
    function nameValid() {
        return (nameRaw.length > 1000) ? '0' : '1';
    }
    function phoneValid() {
        return (phoneRaw.length <= 1000 && (phoneRaw === '' || phoneRaw.replace(/[^0-9]+/g, '').length > 8)) ? '1' : '0';
    }        
    if (ratingValid() === '1' && improvementsValid() === '1' && nameValid() === '1' && phoneValid() === '1') {
        if (passedHoneypot) {
            notifyClient
                .sendEmail('6af9c0cd-2b28-4605-8bfd-1b79dc5c6b30', config.get('notify.mailto'), {
                    personalisation : {
                        rating : ratingRaw,
                        improvements : improvementsRaw,
                        name : nameRaw,
                        phone : phoneRaw,
                        page : fromPage
                    }
                })
                .then(() => {
                    logType.info('Feedback sent successfully');
                    res.clearCookie('feedback');
                    res.redirect('/thank-you' + postSubmissionRedirect);
                })
                .catch((err) => {
                    logType.error('Error sending feedback via notify: ' + err);
                    res.status(500).render('errors/500');
                });
        } else {
            res.clearCookie('feedback');
            logType.info('BOT detected. Doing fake send');
            res.redirect('/thank-you'); // don't post the request just go to the next page.
        }
    } else {
        logType.info('Form Fields Invalid');
        res.redirect('feedback?rating=' + ratingValid() + '&improvements=' + improvementsValid() +
                             '&name=' + nameValid() + '&phone=' + phoneValid());
    }
}

module.exports.sendFeedback = sendFeedback;
