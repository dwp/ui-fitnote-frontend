const rp = require('request-promise-native');
const config = require('config');
const logger = require('../../functions/bunyan');

function checkYourAnswersPage(req, res) {
  const logType = logger.child({ widget: 'checkYourAnswersPage' });
  const queue = [];
  const options = {
    method: 'POST',
    json: true,
    timeout: 240000,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    body: { sessionId: req.cookies.sessionId },
  };

  options.url = `${config.get('api.url')}/queryNino`;
  queue.push(rp(options));

  options.url = `${config.get('api.url')}/queryAddress`;
  queue.push(rp(options));

  options.url = `${config.get('api.url')}/queryMobile`;
  queue.push(rp(options));

  Promise.all(queue)
    .then((returnedDataArray) => {
      const { nino } = returnedDataArray[0];
      const house = returnedDataArray[1].claimantAddress.houseNameOrNumber ? returnedDataArray[1].claimantAddress.houseNameOrNumber : '';
      const postcode = returnedDataArray[1].claimantAddress.postcode ? returnedDataArray[1].claimantAddress.postcode : '';
      const mobile = returnedDataArray[2].mobileNumber ? returnedDataArray[2].mobileNumber : '';
      if (nino === '' || house === '' || postcode === '') {
        res.redirect('/index');
      } else {
        res.render('check-your-answers', {
          sessionId: req.cookies.sessionId,
          version: process.env.npm_package_version,
          environment: config.util.getEnv('NODE_ENV'),
          timeStamp: Date.now(),
          nino,
          house,
          postcode,
          mobile,
        });
      }
    })
    .catch((err) => {
      const errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
      logType.error(err);
      res.render(errorUrl);
    });
}

module.exports.checkYourAnswersPage = checkYourAnswersPage;
