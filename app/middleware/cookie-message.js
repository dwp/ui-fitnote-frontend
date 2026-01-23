import qs from "querystring";
import { COOKIE_POLICY_URL } from "../utilities/constants.js";

export function cookieMiddleware(
  mountUrl,
  consentCookieName,
  cookiePolicy,
  cookieDetails,
) {
  const sanitiseUrl = (url) => url.replace(/\/+/g, "/");

  // URL to cookie policy page
  const cookiePolicyUrl = cookiePolicy;
  // URL to cookie details page
  const cookieDetailsUrl = cookieDetails;

  // Set template options for cookie consent banner
  return (req, res, next) => {
    // Get cookie banner flash messages (did you accept / reject)
    if (req.session) {
      res.locals.cookieChoiceMade = req.session.cookieChoiceMade;
      req.session.cookieChoiceMade = undefined;
    }

    // Add current consent cookie value to templates
    if (req.cookies[consentCookieName]) {
      res.locals.consentCookieValue = req.cookies[consentCookieName];
    }

    // Url to submit consent to (used in banner)
    res.locals.consentCookieName = consentCookieName;

    // Set backto query
    const { pathname, search } = new URL(
      String(req.url),
      "https://syfn-service.test/",
    );
    const sanitisedPath = sanitiseUrl(pathname);
    const currentUrl = sanitisedPath + search;

    res.locals.currentUrl = currentUrl;

    // If already on cookie policy page, don't need set backto again
    if (sanitisedPath === cookiePolicyUrl) {
      res.locals.cookiePolicyUrl = currentUrl;
      res.locals.backLink = currentUrl.replace(COOKIE_POLICY_URL, "");
    } else if (pathname === cookieDetailsUrl) {
      const originalBackUrl = currentUrl.replace(
        "/cookies/cookie-details?backto=%2F",
        "",
      );
      res.locals.cookiePolicyUrl = `${cookiePolicyUrl}?${qs.stringify({ backto: originalBackUrl })}`;
    } else {
      res.locals.cookiePolicyUrl = `${cookiePolicyUrl}?${qs.stringify({ backto: currentUrl })}`;
    }
    next();
  };
}
