const photoAudit = require('../../../app/controllers/get/photoAudit.js');
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
    apiURL: 'http://localhost:3004'
}

describe ("photoAuditPage", function () {
    const req = {
        cookies : {
            sessionId : '',
            route : '',
            cookies_agreed : true
        }
    };
    let res = {};
    it("sets imageStatus to 'service-fail' if fitnote controller api is not available", function(done) {
        nock('http://localhost:3004').get('/imagestatus').replyWithError({
            Error : `connect ECONNREFUSED 127.0.0.1:3004
                at Object._errnoException (util.js:1022:11)
                at _exceptionWithHostPort (util.js:1044:20)
                at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1198:14)`,
            code: 'ECONNREFUSED',
            errno: 'ECONNREFUSED',
            syscall: 'connect',
            address: '127.0.0.1',
            port: 3004
        });
        res = { render : function(template, options) {
                assert.equal(options.imageStatus, 'service-fail');
                done();
            }
        };
        photoAudit.photoAuditPage(req, res);
    });
    it("sets imageStatus to 'service-fail' if fitnote controller api returns a 400 response status code", function(done) {
        nock('http://localhost:3004').get('/imagestatus').reply(400);
        res = { render : function(template, options) {
                assert.equal(options.imageStatus, 'service-fail');
                done();
            }
        };
        photoAudit.photoAuditPage(req, res);
    });
    it("sets imageStatus to 'service-fail' if fitnote controller api returns a 500 response status code", function(done) {
        nock('http://localhost:3004').get('/imagestatus').reply(500);
        res = { render : function(template, options) {
                assert.equal(options.imageStatus, 'service-fail');
                done();
            }
        };
        photoAudit.photoAuditPage(req, res);
    });

});