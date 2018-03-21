var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Cookies Table Page", function() {
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

        this.browser.visit('/cookies-table', done);
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
        assert.equal(browser.text('h1'), 'Cookies');
    });

    // GET request Tests
    it('should GET the page successfully', function(done) {
        chai.request(app).get('/cookies-table').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
