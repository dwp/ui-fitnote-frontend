const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const nock = require('nock');
const address = require('../../../../app/controllers/get/address');
const addressMock = require('../../../mocks/addressMock');

const { expect } = chai;
const { assert } = chai;

chai.use(chaiHttp);

describe('Address Page', () => {
  const { req, body, endPoints } = addressMock;
  let res = {};

  it('should call the address page with arguments', (done) => {
    res = {
      render(template, options) {
        assert.equal(template, 'address');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    nock(config.get('api.url'))
      .post(`/${endPoints.queryAddress}`)
      .reply(200, body);
    const spy = chai.spy.on(address, 'addressPage');
    address.addressPage(req, res);
    expect(spy).to.have.been.called();
    expect(spy).to.have.been.called.with(req, res);
  });

  it('should rerender address page with the correct data retrieved from the API', (done) => {
    nock(config.get('api.url'))
      .post(`/${endPoints.queryAddress}`)
      .reply(200, body);

    res = {
      render(template, options) {
        assert.equal(template, 'address');
        assert.equal(options.house, '22');
        assert.equal(options.postcode, 'SW1H 9NA');
        done();
      },
    };
    address.addressPage(req, res);
  });

  it('should render the address page without errors when getErrorMessage doesn\'t return any errors', (done) => {
    nock(config.get('api.url'))
      .post(`/${endPoints.queryAddress}`)
      .reply(200, body);

    res = {
      render(template, options) {
        assert.equal(template, 'address');
        assert.equal(options.errors, '');
        done();
      },
    };
    address.addressPage(req, res);
  });

  it('should rerender error template if any of APIs are wrong', (done) => {
    nock(config.get('api.url'))
      .post(`/${endPoints.queryAddress}`)
      .reply(500, {});
    res = {
      render(template) {
        assert.equal(template, 'errors/500');
        done();
      },
    };
    address.addressPage(req, res);
  });
});
