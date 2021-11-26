/* eslint-disable quotes */
const redirectMapping = {
  "/esa": '/esa',
  "/no-esa": "/no-esa",
  "/method-obtained": "/method-obtained",
  "/guidance-digital": "/guidance-digital",
  "/guidance-paper": "/guidance-paper",
  "/upload": "/upload",
  "/cookies/cookie_policy": "/cookies/cookie_policy",
  "/accessibility-statement": "/accessibility-statement",
  "/photo-audit": "/photo-audit",
  "/nino": "/nino",
  "/address": "/address",
  "/text-message": "/text-message",
  "/check-your-answers": "/check-your-answers",
  "/feedback": "/feedback",
  "/thank-you": "/thank-you",
  "/complete": "/complete",
};

function whiteListValidateRedirect(key) {
  if (key in redirectMapping) {
    return redirectMapping[key];
  }
  return false;
}

module.exports = whiteListValidateRedirect;
