var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Address Page", function() {
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

        this.browser.visit('/address', done);
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
        assert.equal(browser.text('h1'), "Your address");
    });

    it('should detect if a bot tries to fill out the form, and forward to the next page', function(done) {
        var browser = this.browser;
        browser.fill('houseNumberField', '31');
        browser.fill('postcodeField', 'LL154EH');
        browser.fill('countyField', 'England');
        browser.pressButton('Continue').then(function() {
            assert.equal(browser.text('legend'), 'Your text-message number Select Yes or No');
        }).then(done, done);
    });

    it('should accept a house number and postcode and forward to the next page', function(done) {
        var browser = this.browser;
        browser.fill('houseNumberField', '31');
        browser.fill('postcodeField', 'LL154EH');
        browser.pressButton('Continue').then(function() {
            assert.equal(browser.text('legend'), 'Your text-message number Select Yes or No');
        }).then(done, done);
    });

    it('should trigger validation error with blank house number', function(done) {
        chai.request(app)
            .post('/send-address')
            .set('Cookie', 'sessionId=8c3ff690-e926-11e6-bb05-5d7d66580fff')
            .send({"houseNumberField":"", "postcodeField":"s80nr"})
            .end(function (err, res) {
                expect(res.redirects).to.match(/houseNumber=0/);
                done();
            });
    });

    it('should trigger validation error with blank postcode', function(done) {
        chai.request(app)
            .post('/send-address')
            .set('Cookie', 'sessionId=8c3ff690-e926-11e6-bb05-5d7d66580fff')
            .send({"houseNumberField":"2", "postcodeField":""})
            .end(function (err, res) {
                expect(res.redirects[0]).to.match(/postcode=0/);
                done();
            });
    });

    it('should trigger validation error with incorrect postcode', function(done) {
        chai.request(app)
            .post('/send-address')
            .set('Cookie', 'sessionId=8c3ff690-e926-11e6-bb05-5d7d66580fff')
            .send({"houseNumberField":"2", "postcodeField":"asd"})
            .end(function (err, res) {
                expect(res.redirects[0]).to.match(/postcode=0/);
                done();
            });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
