export default function sessionTimeoutMiddleware(
  router,
  proxyUrl,
  sessionTtl,
  timeoutDialogCountdown,
) {
  router.prependUse(proxyUrl, (req, res, next) => {
    res.locals.timeoutDialog = {
      keepAliveUrl: "/session-keep-alive",
      signOutUrl: "https://www.gov.uk/send-fit-note",
      timeoutUrl: "/session-timeout",
      countdown: sessionTtl - timeoutDialogCountdown,
      timeout: sessionTtl,
    };

    next();
  });
}
