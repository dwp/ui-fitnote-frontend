const nock = require('nock');
const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const fs = require('fs');
appRootDirectory = path.join(__dirname, '/../../../..');

const sendPhoto = require('../../../../app/controllers/post/sendPhoto.js');

global.logger = {
    child: () => {
        return {
            info: () => {
            },
            error: () => {
            }
        }
    }
};

global.config = {
    version: '3',
    nodeEnvironment: 'test',
    apiURL: 'http://localhost:3004',
    sessionExpiryPeriod: 120000
}

describe('Send file', function () {
    function buildReq(fileObj) {
        return {
            headers: {
                "content-length":
                    12
            },
            body: {
                page: '/check-your-answers'
            },
            file: fileObj,
            cookies: {
                sessionId: '97w1y2guyg1we'
            }
        }
    }

    function buildRes(expectedRedirect, done) {
        return {
            cookie: function (value, name, properties) {

            },
            redirect: function (template) {
                assert.equal(template, expectedRedirect)
                done()
            }
        }
    }

    it("return type=1 (file missing)", function (done) {
        const expectedUrl = '/?type=1'
        const fileObj = {}

        const req = buildReq(fileObj)
        const res = buildRes(expectedUrl, done())

        sendPhoto.photoUploader(req, res)
    })

    it("return type=2 (heic)", function (done) {
        const expectedUrl = '/?type=2'
        const fileToUpload = fs.readFileSync(path.resolve(__dirname, "../../../../testing/images/sample.heic"))
        const fileObj = {
            fieldname: "userPhoto",
            originalname: "sample.heic",
            encoding: "7bit",
            mimetype: "image/heic",
            buffer: fileToUpload
        }

        const req = buildReq(fileObj)
        const res = buildRes(expectedUrl, done())

        sendPhoto.photoUploader(req, res)

    })

    it("return type=2 (heif)", function (done) {
        const expectedUrl = '/?type=2'
        const fileToUpload = fs.readFileSync(path.resolve(__dirname, "../../../../testing/images/sample.heif"))
        const fileObj = {
            fieldname: "userPhoto",
            originalname: "sample.heif",
            encoding: "7bit",
            mimetype: "image/heif",
            buffer: fileToUpload
        }

        const req = buildReq(fileObj)
        const res = buildRes(expectedUrl, done())

        sendPhoto.photoUploader(req, res)

    })
})
