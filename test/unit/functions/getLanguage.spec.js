const { expect } = require('chai');
const getLanguage = require('../../../app/functions/getLanguage');

describe('getLanguage', () => {
  it("Should return language as english (en) if provided 'en' ", () => {
    const lang = 'en';
    const getLang = getLanguage(lang);
    expect(getLang).to.be.equal('en');
  });

  it("Should return language as welsh (cy) if provided 'cy' ", () => {
    const lang = 'cy';
    const getLang = getLanguage(lang);
    expect(getLang).to.be.equal('cy');
  });

  it("Should defaults language to english (en) if provided lang is not either 'en' or 'cy ", () => {
    const lang = 'abc';
    const getLang = getLanguage(lang);
    expect(getLang).to.be.equal('en');
  });
});
