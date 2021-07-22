var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Method Obtained Page", function() {
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
        this.browser.visit('/method-obtained', done);
    });

     it("should have defined headless browser", (next) => {
        var browser = this.browser;
        assert.isTrue(typeof browser != "undefined");
        assert.isTrue(browser instanceof Browser);
        next();
    });

    it("should see page", () => {
        var browser = this.browser;
        assert.ok(this.browser.success);
        assert.equal(browser.text('h1'), "How did you obtain your fit note?");
    });

    it('should GET the page successfully', (done) => {
        chai.request(app).get('/method-obtained').end( (err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should return query params for no selection, displaying error text', (done) => {
        chai.request(app).get('/method-obtained').end((err, res) => {
            expect('Please select one option to continue').to.exist;
            done();
        });
    });

    describe("User interactions", function() {
        it('should display an error if there is no selection', function(done) {
            var browser = this.browser;
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('#method-obtained-error'), 'Please select one option to continue');
            }).then(done, done);
        });

        it('should accept "paper" as a selection then forward to "/upload-paper" page', function(done) {
            var browser = this.browser;
            browser.choose('paper');
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), 'Upload your fit note');
            }).then(done, done);
        });

        it('should accept "email" as a selection then forward to "/upload-email" page', function(done) {
            var browser = this.browser;
            browser.choose('email');
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), 'Upload your fit note');
            }).then(done, done);
        });

        it('should accept "sms" as a selection then forward to "/upload-sms" page', function(done) {
            var browser = this.browser;
            browser.choose('sms');
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), 'Upload your fit note');
            }).then(done, done);
        });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
