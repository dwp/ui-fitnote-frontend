import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import express from 'express';
import init from '../../../app/functions/i18n.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('i18n', () => {
  let app;
  let nunjucksEnvironmentMock;
  let lang;

  beforeEach(() => {
    app = express();
    nunjucksEnvironmentMock = {
      addGlobal: sinon.stub(),
    };
    app.use((req, res, next) => {
      res.nunjucksEnvironment = nunjucksEnvironmentMock;
      next();
    });

    init(app, ['../../../app/locales'], ['en', 'cy']);

    app.get('/', (req, res, next) => {
      res.status(200).send('OK');
      lang = res.locals.language;
      next();
    });
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  it('should set language based on query param (en)', (done) => {
    chai.request(app)
      .get('/?lang=en', (err, res) => {
        lang = res.locals.language;
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(lang).to.be.equal('en');
        done();
      });
  });

  it('should set translation language based on query param (cy)', (done) => {
    chai.request(app)
      .get('/?lang=cy', (err, res) => {
        lang = res.locals.language;
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(lang).to.be.equal('cy');
        done();
      });
  });
});
