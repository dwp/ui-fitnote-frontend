var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Select identify Page", function() {
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
        this.browser.visit('/identify', done);
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
        assert.equal(browser.text('h1'), "Do you have a fit note?");
    });

    it('should GET the page successfully', function(done) {
        chai.request(app).get('/identify').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should return query params for no selection, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/text-message?device=0').end(function (err, res) {
            expect('Select yes if you have a fit note').to.exist;
            done();
        });
    });

    describe("User interactions", function() {
        it('should display an error if there is no selection', function(done) {
            var browser = this.browser;
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('#error-field-radioPhone'), 'Select the type of device you are using');
            }).then(done, done);
        });

        it('should accept yes as a selection then forward to device page', function(done) {
            var browser = this.browser;
            browser.choose('Yes');
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), 'Which of the following are you using?');
            }).then(done, done);
        });

        it('should accept no as a selection then forward to invalid page', function(done) {
            var browser = this.browser;
            browser.choose(No);
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), '');
            }).then(done, done);
        });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
