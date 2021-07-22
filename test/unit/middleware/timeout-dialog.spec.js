const {expect} = require('chai');
const Request = require('../../helpers/fake-request.js');
const Response = require('../../helpers/fake-response.js');
const timeoutDialog = require('../../../app/middleware/timeout-dialog.js');

describe('Middleware: session-timeout', () => {

    it('should add timeoutDialog object to res.locals', () => {
        const req = new Request();
        const res = new Response(req);
        timeoutDialog(req, res, () => {
        });

        expect(res.locals.timeoutDialog).to.be.an('object');
    });

    it('should add keepAliveUrl to timeoutDialog', () => {
        const req = new Request();
        const res = new Response(req);
        timeoutDialog(req, res, () => {
        });

        expect(res.locals.timeoutDialog).to.have.property('keepAliveUrl').that.equals('/refresh-session');
    });

    it('should add keepAliveUrl to timeoutDialog', () => {
        const req = new Request();
        const res = new Response(req);
        timeoutDialog(req, res, () => {
        });

        expect(res.locals.timeoutDialog).to.have.property('keepAliveUrl').that.equals('/refresh-session');
    });


    it('should add countdown to timeoutDialog', () => {
        const req = new Request();
        const res = new Response(req);
        timeoutDialog(req, res, () => {
        });

        expect(res.locals.timeoutDialog).to.have.property('countdown').that.equals(300);
    });

    it('should add timeout to timeoutDialog', () => {
        const req = new Request();
        const res = new Response(req);
        timeoutDialog(req, res, () => {
        });

        expect(res.locals.timeoutDialog).to.have.property('timeout').that.equals(600
        );
    });
});
