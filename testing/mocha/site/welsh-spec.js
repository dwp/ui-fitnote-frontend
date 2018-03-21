var app = require("../../../app/app.js");
var Browser = require("zombie");
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
chai.use(chaiHttp);

describe("Welsh Pages", function() {
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
        });
        done();
    });

    it("should render index page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/index?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Defnyddiwch y gwasanaeth hwn i anfon eich nodyn ffitrwydd ar gyfer eich cais Lwfans Cyflogaeth a Cymorth');
            next();
        })
    });

    it("should render device page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/device?lang=cy').then(function(){
            assert.equal(browser.text('h1'), "P'un o'r canlynol ydych chi'n eu defnyddio?");
            next();
        })
    });

    it("should render upload a photo page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/upload-a-photo?lang=cy').then(function(){
            assert.equal(browser.text('h1'), "Arbedwch a lan lwythwch eich nodyn ffitrwydd");
            next();
        })
    });

    it("should render take a photo page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/take-a-photo?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Tynnwch lun');
            next();
        })
    });

    it("should render photo audit page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/photo-audit?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Gwirio eich llun');
            next();
        })
    });

    it("should render nino page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/nino?lang=cy').then(function(){
            assert.equal(browser.text('legend'), 'Rhif Yswiriant Gwladol');
            next();
        })
    });

    it("should render address page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/address?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Eich cyfeiriad');
            next();
        })
    });

    it("should render text message page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/text-message?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Ydych chi eisiau neges testun i gadarnhau bod eich nodyn ffitrwydd wedi cael ei dderbyn?');
            next();
        })
    });

    it("should render complete page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/complete?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Derbyniwyd');
            next();
        })
    });

    it("should render cookies page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/cookies?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Cwcis');
            next();
        })
    });

    it("should render cookies-table page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/cookies-table?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Cwcis');
            next();
        })
    });

    it("should render feedback page with welsh content", function(next){
        var browser = this.browser;
        browser.visit('/feedback?lang=cy').then(function(){
            assert.equal(browser.text('h1'), 'Rhoi adborth');
            next();
        })
    });

    after(function(done) {
        // after ALL the tests, close the server
        this.server.close(done);
    });
});
