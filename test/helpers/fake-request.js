const noop = () => {};

module.exports = class Request {
  constructor() {
    this.body = {};
    this.cookies = {};
    this.headers = {};
    this.params = {};
    this.query = {};
    this.log = {
      info: noop,
      debug: noop,
      error: noop,
      trace: noop,
      warn: noop,
      fatal: noop,
    };
    this.sessionSaved = false;
    this.sessionDestroyed = false;
    this.session = {
      destroy: (cb) => {
        this.sessionDestroyed = true;
        return cb();
      },
      save: (cb) => {
        this.sessionSaved = true;
        return cb();
      },
    };
    this.i18nTranslator = {
      t: (key, value) => `${key}${value ?? ''}`,
    };
  }

  get(header) {
    return this.headers[header];
  }
};
