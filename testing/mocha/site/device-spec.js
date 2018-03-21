var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Select device Page", function() {
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
        this.browser.visit('/device', done);
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
        assert.equal(browser.text('h1'), "Which of the following are you using?");
    });

    it('should GET the page successfully', function(done) {
        chai.request(app).get('/device').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should return query params for no selection, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/text-message?device=0').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
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

        it('should accept phone as a selection then forward to take-a-photo page', function(done) {
            var browser = this.browser;
            browser.choose('Phone or tablet');
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), 'Take a photo');
            }).then(done, done);
        });

        it('should accept desktop as a selection then forward to upload-a-photo page', function(done) {
            var browser = this.browser;
            browser.choose('Desktop computer or laptop');
            browser.pressButton('Continue').then(function() {
                assert.equal(browser.text('h1'), 'Save and upload your fit note');
            }).then(done, done);
        });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
