var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Text Message Page", function() {
    process.env.NODE_ENV = 'test';

    before(function() {
        this.server = app.listen(3000);
        this.browser = new Browser({site: 'http://localhost:3000', debug: true});
    });

    // load the  page before each test
    beforeEach(function(done) {
        this.browser.setCookie({
            name: 'sessionId',
            domain: 'localhost',
            value: '8c3ff690-e926-11e6-bb05-5d7d66580fff'
        }, done);
        this.browser.visit('/text-message', done);
    });

     it("should have defined headless browser", function(next){
        var browser = this.browser;
        assert.isTrue(typeof browser != "undefined");
        assert.isTrue(browser instanceof Browser);
        next();
    });

    it("should see page", function() {
        var browser = this.browser;
        assert.ok(this.browser.success);
        assert.equal(browser.text('legend'), "Your text-message number Select Yes or No");
    });

    it('should GET the page successfully', function(done) {
        chai.request(app).get('/text-message').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should return query params for submitting no mobile number, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/text-message?text=0').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

    it('should return query params for not answering if you would like text message updates, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/text-message?text=1').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

    describe("User interactions", function() {
         it('should detect if a bot tries to fill out the form, and forward to the next page', function(done) {
            var browser = this.browser;
            browser.choose('Yes');
            browser.fill('mobileNumberField', '07723345556');
            browser.fill('landlineField', '01723456543');

            browser.pressButton('Submit').then(function() {
              assert.equal(browser.text('h1'), 'Received');
            }).then(done, done);
        });

        it('should display an error if the mobile number is in the wrong format', function(done) {
            var browser = this.browser;
            browser.choose('Yes');
            browser.fill('mobileNumberField', 'ABC123');
            browser.pressButton('Submit').then(function() {
                assert.equal(browser.text('#error-field-mobileFieldID'), 'Check mobile phone number format');
            }).then(done, done);
        });

        it('should accept a mobile number and confirmation then forward to complete page', function(done) {
            var browser = this.browser;
            browser.choose('Yes');
            browser.fill('mobileNumberField', '07723345556');
            browser.pressButton('Submit').then(function() {
                assert.equal(browser.text('h1'), 'Received');
            }).then(done, done);
        });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
