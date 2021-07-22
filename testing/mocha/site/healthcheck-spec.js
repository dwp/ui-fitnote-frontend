var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Health Check", function() {
    process.env.NODE_ENV = 'test';

    before(function() {
        this.server = app.listen(3000);
        this.browser = new Browser({site: 'http://localhost:3000'});
    });

    // load the  page before each test
    beforeEach(function(done) {
        this.browser.visit('/cookies', done);
    });

    it('should GET the correct response', function(done) {
        chai.request(app).get('/healthcheck').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});