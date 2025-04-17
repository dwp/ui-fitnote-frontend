import chai from 'chai';

const { assert } = chai;
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import sendPhoto from '../../../../app/controllers/post/sendPhoto.js';

global.logger = {
  child: () => ({
    info: () => {
    },
    error: () => {
    },
  }),
};

global.config = {
  version: '3',
  nodeEnvironment: 'test',
  apiURL: 'http://localhost:3004',
  sessionExpiryPeriod: 120000,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Send file', () => {
  function buildReq(fileObj) {
    return {
      headers: {
        'content-length':
                    12,
      },
      body: {
        page: '/check-your-answers',
      },
      file: fileObj,
      cookies: {
        sessionId: '97w1y2guyg1we',
      },
    };
  }

  function buildRes(expectedRedirect, done) {
    return {
      redirect(template) {
        assert.equal(template, expectedRedirect);
        done();
      },
    };
  }

  it('return type=1 (file missing)', (done) => {
    const expectedUrl = '/?type=1';
    const fileObj = {};

    const req = buildReq(fileObj);
    const res = buildRes(expectedUrl, done());

    sendPhoto.photoUploader(req, res);
  });

  it('return type=2 (heic)', (done) => {
    const expectedUrl = '/?type=2';
    const fileToUpload = fs.readFileSync(path.resolve(__dirname, './images/sample.heic'));
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

  it('return type=2 (heif)', (done) => {
    const expectedUrl = '/?type=2';
    const fileToUpload = fs.readFileSync(path.resolve(__dirname, './images/sample.heif'));
    const fileObj = {
      fieldname: 'userPhoto',
      originalname: 'sample.heif',
      encoding: '7bit',
      mimetype: 'image/heif',
      buffer: fileToUpload,
    };

    const req = buildReq(fileObj);
    const res = buildRes(expectedUrl, done());

    sendPhoto.photoUploader(req, res);
  });
});
