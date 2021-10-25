const accessibilityStatement = require('../../../../app/controllers/get/accessibilityStatement');
const config = require('config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const spies = require('chai-spies');
const nock = require('nock');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
chai.use(spies);

describe('Accessibility Statement', () => {
    const req = {
        cookies: {
            sessionId: '97w1y2guyg1wd555',
            cookies_agreed: true
        }
    };

    it('Should call accessibility function successfully', function (done) {
        let res = {
            render: function (template, options) {
                assert.equal(template, 'accessibility-statement');
                assert.equal(options.version, process.env.npm_package_version);
                assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
                done();
            }
        }
        const spy = chai.spy.on(accessibilityStatement, 'accessibilityPage');
        accessibilityStatement.accessibilityPage(req, res)
        expect(spy).to.have.been.called();
        expect(spy).to.have.been.called.with(req, res);
    });

    it('Should make a GET request to accessibility statement page' +
        ' successfully', (done) => {
        nock('http://localhost:3004')
            .get('/accessibility-statement')
            .reply(200, {})
        let res = {
            render: function (template, options) {
                assert.equal(template, 'accessibility-statement');
                assert.equal(options.version, process.env.npm_package_version);
                assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
                done();
            }
        }
        accessibilityStatement.accessibilityPage(req, res)
    });

});
