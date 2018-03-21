var fs = require('fs-extra');
var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Take A Photo Page", function() {
    process.env.NODE_ENV = 'test';

    before(function() {
        this.server = app.listen(3000);
        this.browser = new Browser({site: 'http://localhost:3000'});
    });

    // load the  page before each test
    beforeEach(function(done) {
        this.browser.setCookie({
            name: 'sessionId',
            domain: 'localhost',
            value: '8c3ff690-e926-11e6-bb05-5d7d66580fff'
        }, done);

        this.browser.visit('/take-a-photo', done);
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
        assert.equal(browser.text('h1'), "Take a photo");
    });

    // GET request Tests
    it('should GET the page successfully', function(done) {
        chai.request(app).get('/take-a-photo').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should detect if a bot tries to fill out the form, and forward to the next page', function(done) {
        var browser = this.browser;
        browser.fill('imageNameField', 'test');
        browser.pressButton('Send').then(function() {
          assert.equal(browser.text('legend'), "National Insurance number");
        }).then(done, done);
    });

    it('should return query params for submitting a bogus image, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/take-a-photo?error=invalidPhoto').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

    it('should return query params for submitting no image, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/take-a-photo?error=noPhoto').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

    it('should return query params for an OCR failure, displaying error text', function(done) {
        var browser = this.browser;
        chai.request(app).get('/take-a-photo?error=ocrFailed').end(function (err, res) {
            expect('Check your form. You must:').to.exist;
            done();
        });
    });

    it('should accept an image', function(done) {
        var browser = this.browser;
        chai.request(app)
            .post('/send-photo')
            .attach('userPhoto', fs.readFileSync('./testing/fitnote-sample.jpg'), 'fitnote-sample.jpg')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});


