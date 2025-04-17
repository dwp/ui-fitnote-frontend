import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import address from '../../../../app/controllers/get/address.js';
import addressMock from '../../../mocks/addressMock.js';

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
    address(req, res);
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
    address(req, res);
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
    address(req, res);
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
    address(req, res);
  });
});
