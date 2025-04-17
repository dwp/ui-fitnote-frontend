import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import fs from 'fs';
import sinon from 'sinon';
import { fileURLToPath } from 'url';
import app from '../../../../app/app.js';
import sendNino from '../../../../app/controllers/post/sendNino.js';
import sendAddress from '../../../../app/controllers/post/sendAddress.js';
import sendPhoto from '../../../../app/controllers/post/sendPhoto.js';
import cya from '../../../../app/controllers/post/checkYourAnswers.js';

const { assert } = chai;
chai.use(chaiHttp);

const page = '/check-your-answers';
const sessionId = '97w1y2guyg1we';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    sendNino(req, buildRes('/address', done()));
  });

  it('Submit address', (done) => {
    const req = buildReq();
    sendAddress(req, buildRes('/text-message', done()));
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

    sendPhoto(req, res);
  });

  it('CYA proceed to complete', (done) => {
    const req = buildReq();
    chai.request(app)
      .post(page)
      .end((err) => {
        if (err) {
          done(err);
        }
        cya(req, buildRes('/complete', done()));
      });
  });
});
