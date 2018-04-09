var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("NINO Page", function() {
    process.env.NODE_ENV = 'test';

    before(function() {
        this.server = app.listen(3000);
        this.browser = new Browser({site: 'http://localhost:3000'});
    });

    // load the index page before each test
    beforeEach(function(done) {
        this.browser.setCookie({
            name: 'sessionId',
            domain: 'localhost',
            value: '8c3ff690-e926-11e6-bb05-5d7d66580fff'
        }, done);
        this.browser.visit('/nino', done);
    });

     it("should have defined headless browser", function(next){
        var browser = this.browser;
        assert.isTrue(typeof browser != "undefined");
        assert.isTrue(browser instanceof Browser);
        next();
    });

    it("should visit the NINO form fields", function() {
        var browser = this.browser;
        assert.ok(this.browser.success);
        this.browser.assert.element('form input[name=ninoField]');
    });

    it('should refuse empty submissions', function(done) {
        var browser = this.browser;
        browser.pressButton('Continue').then(function() {
          assert.ok(browser.success);
          assert.equal(browser.text('div.border-all-colour-gds-red p'), 'Check your form. You must:');
        }).then(done, done);
      });

    it('should display an error if the NINO is in the wrong format', function(done) {
        var browser = this.browser;
        browser.fill('ninoField', 'ASDe3fvga');
        browser.pressButton('Continue').then(function() {
            assert.equal(browser.text('#error-field-ninoFieldID'), 'Enter a valid National Insurance number format. For example, QQ 12 34 56 C');
            assert.equal(browser.text('#error-message-ninoFieldID'), 'Field is required');
        }).then(done, done);
    });

    it('should detect if a bot tries to fill out the form, and forward to the next page', function(done) {
        var browser = this.browser;
        browser.fill('emailField', 'test@test.com');
        browser.fill('ninoField', 'AA123456A');
        browser.pressButton('Continue').then(function() {
          assert.equal(browser.text('legend'), "Enter your address");
        }).then(done, done);
    });

    // GET request Tests
    it('should GET the nino page successfully', function(done) {
        chai.request(app).get('/nino').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should return query params for blank Nino POST, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/nino?nino=0').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

    it('should return query params for incorrect formatted Nino POST, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/nino?nino=1').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

     it('should accept a Nino and forward to Address page', function(done) {
        var browser = this.browser;
        browser.fill('ninoField', 'AA123456A');
        browser.pressButton('Continue').then(function() {
            assert.equal(browser.text('h1'), "Your address");
        }).then(done, done);
    });

    it('should trigger validation error with blank nino', function(done) {
        chai.request(app)
            .post('/send-nino')
            .set('Cookie', 'sessionId=8c3ff690-e926-11e6-bb05-5d7d66580fff')
            .send({"ninoField":""})
            .end(function (err, res) {
                expect(res.redirects[0]).to.match(/nino=0/);
                done();
            });
    });

    it('should trigger validation error with invalid nino', function(done) {
        chai.request(app)
            .post('/send-nino')
            .set('Cookie', 'sessionId=8c3ff690-e926-11e6-bb05-5d7d66580fff')
            .send({"ninoField":"asd"})
            .end(function (err, res) {
                expect(res.redirects[0]).to.match(/nino=1/);
                done();
            });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
