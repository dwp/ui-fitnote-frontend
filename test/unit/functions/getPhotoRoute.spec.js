const { expect } = require('chai');
const { getRoute } = require('../../../app/functions/getPhotoRoute');

describe('getPhotoRoute', () => {
  it('should default to "take" when no route in cookie', () => {
    const req = { cookies: {} };
    const expectedResult = 'take';
    const result = getRoute(req);
    expect(result).to.be.equal(expectedResult);
  });

  it('should return digital route when route is upload-digital in cookie', () => {
    const req = {
      cookies: {
        route: 'upload-digital',
      },
    };
    const expectedResult = 'upload?ref=digital';
    const result = getRoute(req);
    expect(result).to.be.equal(expectedResult);
  });

  it('should return digital route when route is upload-paper in cookie', () => {
    const req = {
      cookies: {
        route: 'upload-paper',
      },
    };
    const expectedResult = 'upload?ref=paper';
    const result = getRoute(req);
    expect(result).to.be.equal(expectedResult);
  });

  it('should return custom route when route exists in cookie and is not paper/digital', () => {
    const req = {
      cookies: {
        route: 'upload-fax',
      },
    };
    const expectedResult = 'upload-fax';
    const result = getRoute(req);
    expect(result).to.be.equal(expectedResult);
  });
});
