import { expect } from 'chai';
import Request from '../../helpers/fake-request.js';
import Response from '../../helpers/fake-response.js';
import timeoutDialog from '../../../app/middleware/timeout-dialog.js';

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

    expect(res.locals.timeoutDialog).to.have.property('timeout').that.equals(600);
  });
});
