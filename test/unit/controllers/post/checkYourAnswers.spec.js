const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');
const app = require('../../../../app/app');
const sendNino = require('../../../../app/controllers/post/sendNino.js');
const sendAddress = require('../../../../app/controllers/post/sendAddress.js');
const sendPhoto = require('../../../../app/controllers/post/sendPhoto.js');
const cya = require('../../../../app/controllers/post/checkYourAnswers.js');

const { assert } = chai;
chai.use(chaiHttp);

const page = '/check-your-answers';
const sessionId = '97w1y2guyg1we';

function buildReq(fileObj) {
  return {
    headers: {
      'content-length': 12,
    },
    body: {
      page,
      sessionId,
      accepted: true,
    },
    file: fileObj,
    cookies: {
      sessionId,
    },
  };
}

function buildRes(expectedRedirect, done) {
  return {
    redirect(template) {
      assert.equal(template, expectedRedirect);
      done();
    },
    status: () => ({
      render: () => {},
      redirect: () => {},
    }),
    cookie: sinon.spy(),
  };
}

describe('CYA (POST)', () => {
  it('Submit nino', (done) => {
    const req = buildReq();
    sendNino.sendNino(req, buildRes('/address', done()));
  });

  it('Submit address', (done) => {
    const req = buildReq();
    sendAddress.sendAddress(req, buildRes('/text-message', done()));
  });

  it('return type=2 (heic)', (done) => {
    const expectedUrl = '/?type=2';
    const fileToUpload = fs.readFileSync(path.resolve(__dirname, './images/sample.heif'));
    const fileObj = {
      fieldname: 'userPhoto',
      originalname: 'sample.heic',
      encoding: '7bit',
      mimetype: 'image/heic',
      buffer: fileToUpload,
    };

    const req = buildReq(fileObj);
    const res = buildRes(expectedUrl, done());

    sendPhoto.photoUploader(req, res);
  });

  it('CYA proceed to complete', (done) => {
    const req = buildReq();
    chai.request(app)
      .post(page)
      .end((err) => {
        if (err) {
          done(err);
        }
        cya.acceptAndSend(req, buildRes('/complete', done()));
      });
  });
});
