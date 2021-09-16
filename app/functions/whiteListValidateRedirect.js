/* eslint-disable quotes */
const redirectMapping = {
    "/identify" : '/identify',
    "/invalid" : "/invalid",
    "/method-obtained" : "/method-obtained",
    "/upload-paper" : "/upload-paper",
    "/upload-sms" : "/upload-sms",
    "/upload-email" : "/upload-email",
    "/cookies/cookie_policy" : "/cookies/cookie_policy",
    "/accessibility-statement" : "/accessibility-statement",
    "/photo-audit" : "/photo-audit",
    "/nino" : "/nino",
    "/address" : "/address",
    "/text-message" : "/text-message",
    "/check-your-answers" : "/check-your-answers",
    "/feedback" : "/feedback",
    "/thank-you" : "/thank-you",
    "/complete" : "/complete"
};

function whiteListValidateRedirect(key) {
    if (key in redirectMapping) {
        return redirectMapping[key];
    } else {
        return false;
    }
}

module.exports = whiteListValidateRedirect;
