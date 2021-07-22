const cya = require('../../../../app/controllers/get/checkYourAnswers.js');
const nock = require('nock');
const chai = require('chai');
const assert = chai.assert;
global.logger = { child : () => {
        return { error : () => {} }
    }};

global.config = {
    version: '3',
    nodeEnvironment: 'test',
    apiURL: 'http://localhost:3004'
}

describe('Check your answers page', function() {
    const req = {
        cookies : {
            sessionId : '97w1y2guyg1wd',
            cookies_agreed : true
        }
    };
    let res = {};
    it('should render the check your answers page if all data retrieved from apis', function(done) {
        nock('http://localhost:3004')
            .post('/queryNino')
            .reply(200, { nino : 'AA123456A'})
            .post('/queryAddress')
            .reply(200, { claimantAddress : { houseNameOrNumber : '44', postcode : 'S13 7QJ'}})
            .post('/queryMobile')
            .reply(200, { mobileNumber : '07770111111'});

        res = { render : function(template, options) {
                assert.equal(template, 'check-your-answers');
                assert.equal(options.nino, 'AA123456A');
                assert.equal(options.house, '44');
                assert.equal(options.postcode, 'S13 7QJ');
                assert.equal(options.mobile, "07770111111");
                done();
            }
        };
        cya.checkYourAnswersPage(req, res);
    });

    it('should render the 500 error page if there is an error from one of the apis', function(done) {
        nock('http://localhost:3004')
            .post('/queryNino', { sessionId : '97w1y2guyg1we'})
            .reply(400, {})
            .post('/queryAddress', { sessionId : '97w1y2guyg1we'})
            .reply(200, { claimantAddress : { houseNameOrNumber : '55', postcode : 'LS3 7QJ'}})
            .post('/queryMobile', { sessionId : '97w1y2guyg1we'})
            .reply(200, { mobileNumber : '07770222222' });
        res = { render : function(template) {
                assert.equal(template, 'errors/500');
                done();
            }
        };
        cya.checkYourAnswersPage(req, res);
    });
});