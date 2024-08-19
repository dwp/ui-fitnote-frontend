const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../app/app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Feedback Page (redirect)', () => {
  const newFeedbackURL = 'https://forms.office.com/pages/responsepage.aspx?id=DpxP-knna0i8NIr6EGM3VsmUfSVlj39Dm5IoDLk2jmRUMThGTFhLMURFTkRISFdKMTA0U1dWUTg3NiQlQCN0PWcu';

  it('Should detect the status code 308', (done) => {
    chai.request(app)
      .get('/feedback')
      .redirects(0)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        assert.equal(res.status, 308);
        done();
      });
  });

  it('Should detect the redirect URL for the MS feedback form', (done) => {
    chai.request(app)
      .get('/feedback')
      .redirects(0)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        assert.equal(res.header.location, newFeedbackURL);
        done();
      });
  });
});
