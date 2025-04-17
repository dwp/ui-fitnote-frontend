/**
 * Configure multi-lingual support.
 *
 * This middleware will determine the language to use for each request, and make
 * that information available in `req.language`, and store it in the session at
 * `req.session.language`.
 *
 * Enhances `req` with:
 *   string language = The language code to use (ISO 639-1)
 *   function i18nTranslator = A class instance to translate for the current req.
 */
import config from 'config';
import i18n from '../lib/I18n.js';
import getLanguage from './getLanguage.js';

export default function init(app, appLocaleDirs, supportedLocales) {
  // Initialise the I18n utility
  const I18n = i18n(appLocaleDirs, supportedLocales);

  /**
   * Detect chosen language from one of the following sources (sources further
   * down the list take precedence):
   *  First element in `supportedLocales`
   *  `req.session.language`
   *  `req.params.lang`.
   *
   * Stores the chosen language in `req.language` and the object used for
   * translation in `req.i18nTranslator`.
   */
  app.use((req, res, next) => {
    if (typeof req.query.lang !== 'undefined' && supportedLocales.indexOf(req.query.lang) > -1) {
      req.language = req.query.lang === 'cy' ? 'cy' : 'en';
      res.cookie('language', req.language, {
        httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
      });
    } else {
      req.language = req.cookies.language || supportedLocales[0];
    }

    res.locals.language = getLanguage(req.language);
    req.i18nTranslator = new I18n.Translator(getLanguage(req.language));

    next();
  });

  /**
   * Add the `t()` global function to the Nunjuck engine. This will make it
   * available to all templates, including macros.
   */
  app.use((req, res, next) => {
    res.nunjucksEnvironment.addGlobal(
      't',
      req.i18nTranslator.t.bind(req.i18nTranslator),
    );

    next();
  });
}
