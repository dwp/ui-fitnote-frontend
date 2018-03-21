var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Feedback Pages", function() {
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
            value: '8c3ff690-e926-11e6-bb05-5d7d66580fff',
            feedback: '/index'
        });
        done();
    });

    it("should render feedback page", function(next){
        var browser = this.browser;
        browser.visit('/feedback').then(function(){
            assert.equal(browser.text('h1'), 'Give feedback');
            next();
        })
    });

    it("should show front end validation error if submitted without a rating", function(next){
        var browser = this.browser;
        browser.visit('/feedback').then(function(){
            browser.pressButton('Send feedback').then(function() {
                assert.ok(browser.success);
                browser.assert.elements('.form-group.error', 1);
                next();
            })
        })
    });

    it("should show front end validation error if submitted with an improvement suggestion greater than 1200 chars", function(next){
        var browser = this.browser;
        browser.visit('/feedback').then(function(){
            browser.fill('improvements', '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1');
            browser.pressButton('Send feedback').then(function() {
              assert.ok(browser.success);
              browser.assert.elements('.form-group.error', 2);
              next();
            })
        })
    });

    it("should show thank you page if completed correctly", function(next){
        var browser = this.browser;
        browser.visit('/feedback').then(function(){
            browser.choose('#vSatisfied');
            browser.fill('improvements', 'test');
            browser.pressButton('Send feedback').then(function() {
              assert.ok(browser.success);
              browser.assert.text('h1', 'Thank you');
              next();
            })
        })
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
