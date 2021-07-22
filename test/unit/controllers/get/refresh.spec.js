const refresh = require('../../../../app/controllers/get/refresh.js');
const nock = require('nock');
const chai = require('chai');
const assert = chai.assert;
global.logger = { child : () => {
        return { info : () => {},
            error : () => {} }
    }};

global.config = {
    version: '3',
    nodeEnvironment: 'test',
    apiURL: 'http://localhost:3004',
    sessionExpiryPeriod: 120000
}

describe('Session expiry time reset', function() {
    const req = {
            body : {
                page : '/check-your-answers'
            },
            cookies : {sessionId : '97w1y2guyg1we'}
    };
    let res = {};

    it('should render the 500 error page if there is a 500 error from calling the api', function (done) {
        nock('http://localhost:3004')
            .get('/extendSession?sessionId=97w1y2guyg1we')
            .reply(500, {});
        res = {
            status: function(code) {
                return {
                    render: function (template) {
                        assert.equal(template, 'errors/500');
                        done();
                    }
                }
            }
        };
        refresh.refresh(req, res);
    });

    it('should render the 500 error page if there is a 400 error from the api', function (done) {
        nock('http://localhost:3004')
            .get('/extendSession?sessionId=97w1y2guyg1we')
            .reply(400, {});
        res = {
            status: function(code) {
                return {
                    render: function (template) {
                        assert.equal(template, 'errors/500');
                        done();
                    }
                }
            }
        };
        refresh.refresh(req, res);
    });

    it('should reset the session expiry time and render the existing page when api call is successful', function (done) {
        nock('http://localhost:3004')
            .get('/extendSession?sessionId=97w1y2guyg1we')
            .reply(200, {});
        res = {
            status: function(code) {
                return {
                    json: function (body) {
                        assert.equal(code, 200);
                        assert.equal(body['message'],  'OK' );
                        assert.equal(body['status'],  200 );
                        done();
                    }
                }
            },
            cookie: function(name, value, properties) {
                assert.equal(name, 'exp');
            }
        };
        refresh.refresh(req, res);
    });
});
