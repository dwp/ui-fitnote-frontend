import TimeoutDialog from "hmrc-frontend/hmrc/components/timeout-dialog/timeout-dialog";
import SessionActivityService from "hmrc-frontend/hmrc/components/timeout-dialog/session-activity-service";

/**
 * @param opts
 */
function initAll(opts) {
  // Set the options to an empty object by default if no options are passed.
  const options = typeof opts !== "undefined" ? opts : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  const scope = typeof options.scope !== "undefined" ? options.scope : document;

  const sessionActivity = new SessionActivityService();

  // HMRC Session Timeout Dialog
  const $TimeoutDialog = scope.querySelector(
    'meta[name="hmrc-timeout-dialog"]',
  );
  if ($TimeoutDialog) {
    new TimeoutDialog($TimeoutDialog, sessionActivity).init();
  }
}

initAll();

export { initAll, TimeoutDialog };
