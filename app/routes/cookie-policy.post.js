import pageNames from "../definitions/pages.js";
import {
  COOKIE_DETAILS_URL,
  COOKIE_POLICY_URL,
} from "../utilities/constants.js";

const oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;

const startPageUrl = "/esa";
const cookiePolicyUrl = COOKIE_POLICY_URL;

const allowedUrls = Object.values(pageNames())
  .filter(
    (item) =>
      item.waypoint &&
      typeof item.waypoint === "string" &&
      item.waypoint.trim() !== "",
  )
  .map((item) => `/${item.waypoint}`);

allowedUrls.push(cookiePolicyUrl);
allowedUrls.push(COOKIE_DETAILS_URL);
allowedUrls.push("/accessibility-statement");
allowedUrls.push("/session-timeout");

export default function cookiePolicyPost(
  consentCookieName,
  mountUrl,
  gtmDomain,
  useTLS = false,
) {
  return (req, res) => {
    const { cookieConsent } = req.body;

    // Validation error, set messeage in session and redirect back to this page
    if (
      !cookieConsent ||
      (cookieConsent !== "reject" && cookieConsent !== "accept")
    ) {
      req.session.cookieConsentError =
        "cookie-policy:field.cookieConsent.required";

      if (
        allowedUrls.includes(req.url) ||
        allowedUrls.some((url) => req.url.startsWith(url))
      ) {
        return req.session.save(() => res.redirect(req.url));
      }

      return res.redirect(cookiePolicyUrl);
    }

    // Validation successful, set cookie and redirect back where they came from
    // via backto query string, if it exists
    res.cookie(consentCookieName, cookieConsent, {
      path: mountUrl,
      maxAge: oneYearInMilliseconds,
      httpOnly: true,
      sameSite: "Strict",
      secure: useTLS,
    });

    // Show cookie accepted / rejected banner
    req.session.cookieChoiceMade = true;

    // If rejected, remove any GA cookies
    if (cookieConsent === "reject" && req.headers.cookie) {
      const gatCookieName = req.headers.cookie.match(/_gat[^=;]*/);
      const cookies = `${req.headers.cookie}`;
      const gaIdCookiesName = cookies
        .split(";")
        .map((cookie) => cookie.trim())
        .map((cookie) => cookie.split("="))
        .filter(([key]) => key.startsWith("_ga_"))
        .map(([key]) => key);

      const options = { path: "/" };

      if (gtmDomain) {
        options.domain = gtmDomain;
      }

      if (gatCookieName) {
        res.clearCookie(gatCookieName[0], options);
      }

      if (gaIdCookiesName && gaIdCookiesName.length > 0) {
        gaIdCookiesName.forEach((cookie) => {
          res.clearCookie(cookie, options);
        });
      }

      res.clearCookie("_ga", options);
      res.clearCookie("_gid", options);
    }

    // backto querystring contains the URL to redirect to
    if (req.query.backto) {
      const { pathname, search } = new URL(
        String(req.query.backto),
        "https://syfn-service.test/",
      );
      const redirectBackTo = (pathname + search)
        .replace(/\/+/g, "/")
        .replace(/[.:]+/g, "");

      if (allowedUrls.includes(redirectBackTo)) {
        return req.session.save(() => res.redirect(redirectBackTo));
      }
    }

    if (allowedUrls.includes(req.url)) {
      return req.session.save(() => res.redirect(req.url));
    }

    return res.redirect(startPageUrl);
  };
}
