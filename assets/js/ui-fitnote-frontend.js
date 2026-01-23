(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = {}));
})(this, (function (exports) { 'use strict';

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  var _console = console,
    warn = _console.warn;
  var utils = {
    generateDomElementFromString: function generateDomElementFromString(str) {
      var abc = document.createElement('div');
      abc.innerHTML = str;
      return abc.firstChild;
    },
    generateDomElementFromStringAndAppendText: function generateDomElementFromStringAndAppendText(str, text) {
      var $tmp = utils.generateDomElementFromString(str);
      $tmp.innerText = text;
      return $tmp;
    },
    hasClass: function hasClass(selector, className) {
      return document.querySelector(selector).classList.contains(className);
    },
    addClass: function addClass(selector, className) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (i) {
        i.classList.add(className);
      });
    },
    removeClass: function removeClass(selector, className) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (i) {
        i.classList.remove(className);
      });
    },
    removeElement: function removeElement($elem) {
      var parent = $elem.parentNode;
      if (parent) {
        parent.removeChild($elem);
      } else {
        warn("couldn't find parent for elem", $elem);
      }
    },
    ajaxGet: function ajaxGet(url, success) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send();
      return xhr;
    }
  };

  function displayDialog($elementToDisplay) {
    var $dialog = utils.generateDomElementFromString('<div id="hmrc-timeout-dialog" tabindex="-1" role="dialog" aria-modal="true" class="hmrc-timeout-dialog">');
    var $overlay = utils.generateDomElementFromString('<div id="hmrc-timeout-overlay" class="hmrc-timeout-overlay">');
    var $preparedElementToDisplay = typeof $elementToDisplay === 'string' ? utils.generateDomElementFromString($elementToDisplay) : $elementToDisplay;
    var resetElementsFunctionList = [];
    var closeCallbacks = [];
    $dialog.appendChild($preparedElementToDisplay);
    if (!utils.hasClass('html', 'noScroll')) {
      utils.addClass('html', 'noScroll');
      resetElementsFunctionList.push(function () {
        utils.removeClass('html', 'noScroll');
      });
    }
    document.body.appendChild($dialog);
    document.body.appendChild($overlay);
    resetElementsFunctionList.push(function () {
      utils.removeElement($dialog);
      utils.removeElement($overlay);
    });
    var setupFocusHandlerAndFocusDialog = function setupFocusHandlerAndFocusDialog() {
      function keepFocus(event) {
        var modalFocus = document.getElementById('hmrc-timeout-dialog');
        if (modalFocus) {
          if (event.target !== modalFocus && !modalFocus.contains(event.target)) {
            event.stopPropagation();
            modalFocus.focus();
          }
        }
      }
      var elemToFocusOnReset = document.activeElement;
      $dialog.focus();
      document.addEventListener('focus', keepFocus, true);
      resetElementsFunctionList.push(function () {
        document.removeEventListener('focus', keepFocus);
        elemToFocusOnReset.focus();
      });
    };

    // disable the non-dialog page to prevent confusion for VoiceOver users
    var selectors = ['#skiplink-container', 'body > header', '#global-cookie-message', 'main', 'body > footer', 'body > .govuk-skip-link', '.cbanner-govuk-cookie-banner', 'body > .govuk-width-container'];
    var elements = document.querySelectorAll(selectors.join(', '));
    var close = function close() {
      while (resetElementsFunctionList.length > 0) {
        var fn = resetElementsFunctionList.shift();
        fn();
      }
    };
    var closeAndInform = function closeAndInform() {
      closeCallbacks.forEach(function (fn) {
        fn();
      });
      close();
    };
    var setupKeydownHandler = function setupKeydownHandler() {
      function keydownListener(e) {
        if (e.keyCode === 27) {
          closeAndInform();
        }
      }
      document.addEventListener('keydown', keydownListener);
      resetElementsFunctionList.push(function () {
        document.removeEventListener('keydown', keydownListener);
      });
    };
    var preventMobileScrollWhileAllowingPinchZoom = function preventMobileScrollWhileAllowingPinchZoom() {
      var handleTouch = function handleTouch(e) {
        var touches = e.touches || e.changedTouches || [];
        if (touches.length === 1) {
          e.preventDefault();
        }
      };
      document.addEventListener('touchmove', handleTouch, true);
      resetElementsFunctionList.push(function () {
        document.removeEventListener('touchmove', handleTouch, true);
      });
    };
    elements.forEach(function ($elem) {
      var value = $elem.getAttribute('aria-hidden');
      $elem.setAttribute('aria-hidden', 'true');
      resetElementsFunctionList.push(function () {
        if (value) {
          $elem.setAttribute('aria-hidden', value);
        } else {
          $elem.removeAttribute('aria-hidden');
        }
      });
    });

    //
    setupFocusHandlerAndFocusDialog();
    setupKeydownHandler();
    preventMobileScrollWhileAllowingPinchZoom();
    return {
      closeDialog: function closeDialog() {
        close();
      },
      setAriaLabelledBy: function setAriaLabelledBy(value) {
        if (value) {
          $dialog.setAttribute('aria-labelledby', value);
        } else {
          $dialog.removeAttribute('aria-labelledby');
        }
      },
      addCloseHandler: function addCloseHandler(closeHandler) {
        closeCallbacks.push(closeHandler);
      }
    };
  }
  var dialog = {
    displayDialog: displayDialog
  };

  function ValidateInput() {}
  ValidateInput["int"] = function (stringToValidate) {
    var parsedInt = parseInt(stringToValidate, 10);
    return Number.isNaN(parsedInt) ? undefined : parsedInt;
  };
  ValidateInput.string = function (stringToValidate) {
    return typeof stringToValidate === 'string' ? stringToValidate : undefined;
  };
  ValidateInput["boolean"] = function (stringToValidate) {
    return String(stringToValidate).toLowerCase() === 'true';
  };

  function RedirectHelper() {}
  RedirectHelper.redirectToUrl = function (url) {
    // This exists to make redirects more testable
    window.location.href = url;
  };

  // TODO: rewrite this to follow govuk-frontend prototype module pattern

  function TimeoutDialog($module, $sessionActivityService) {
    var options = {};
    var settings = {};
    var cleanupFunctions = [];
    var currentTimer;
    var sessionActivityService = $sessionActivityService;
    function init() {
      var validate = ValidateInput;
      function lookupData(key) {
        return ($module.attributes.getNamedItem(key) || {}).value;
      }
      var localisedDefaults = validate.string(lookupData('data-language')) === 'cy' ? {
        title: 'Rydych ar fin cael eich allgofnodi',
        message: 'Er eich diogelwch, byddwn yn eich allgofnodi cyn pen',
        keepAliveButtonText: 'Parhau i fod wedi’ch mewngofnodi',
        signOutButtonText: 'Allgofnodi',
        properties: {
          minutes: 'funud',
          minute: 'funud',
          seconds: 'eiliad',
          second: 'eiliad'
        }
      } : {
        title: 'You’re about to be signed out',
        message: 'For your security, we will sign you out in',
        keepAliveButtonText: 'Stay signed in',
        signOutButtonText: 'Sign out',
        properties: {
          minutes: 'minutes',
          minute: 'minute',
          seconds: 'seconds',
          second: 'second'
        }
      };
      options = {
        timeout: validate["int"](lookupData('data-timeout')),
        countdown: validate["int"](lookupData('data-countdown')),
        keepAliveUrl: validate.string(lookupData('data-keep-alive-url')),
        signOutUrl: validate.string(lookupData('data-sign-out-url')),
        timeoutUrl: validate.string(lookupData('data-timeout-url')),
        title: validate.string(lookupData('data-title')),
        message: validate.string(lookupData('data-message')),
        messageSuffix: validate.string(lookupData('data-message-suffix')),
        keepAliveButtonText: validate.string(lookupData('data-keep-alive-button-text')),
        signOutButtonText: validate.string(lookupData('data-sign-out-button-text')),
        synchroniseTabs: validate["boolean"](lookupData('data-synchronise-tabs') || false),
        hideSignOutButton: validate["boolean"](lookupData('data-hide-sign-out-button') || false)
      };

      // Default timeoutUrl to signOutUrl if not set
      options.timeoutUrl = options.timeoutUrl || options.signOutUrl;
      validateInput(options);
      settings = _mergeOptionsWithDefaults(options, localisedDefaults);
      setupDialogTimer();
      listenForSessionActivityAndResetDialogTimer();
    }
    var broadcastSessionActivity = function broadcastSessionActivity() {
      sessionActivityService.logActivity();
    };
    var listenForSessionActivityAndResetDialogTimer = function listenForSessionActivityAndResetDialogTimer() {
      if (settings.synchroniseTabs) {
        sessionActivityService.onActivity(function (event) {
          var timeOfActivity = event.timestamp;
          cleanup();
          setupDialogTimer(timeOfActivity);
        });
      }
    };
    var validateInput = function validateInput(config) {
      var requiredConfig = ['timeout', 'countdown', 'keepAliveUrl', 'signOutUrl'];
      var missingRequiredConfig = [];
      requiredConfig.forEach(function (item) {
        if (!config[item]) {
          missingRequiredConfig.push("data-".concat(item.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()));
        }
      });
      if (missingRequiredConfig.length > 0) {
        throw new Error("Missing config item(s): [".concat(missingRequiredConfig.join(', '), "]"));
      }
    };
    var _mergeOptionsWithDefaults = function mergeOptionsWithDefaults(theOptions, localisedDefaults) {
      var clone = _objectSpread2({}, theOptions);
      Object.keys(localisedDefaults).forEach(function (key) {
        if (_typeof(clone[key]) === 'object') {
          clone[key] = _mergeOptionsWithDefaults(theOptions[key], localisedDefaults[key]);
        }
        if (clone[key] === undefined || clone[key] === '') {
          clone[key] = localisedDefaults[key];
        }
      });
      return clone;
    };
    var setupDialogTimer = function setupDialogTimer() {
      var timeOfLastActivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDateNow();
      var signoutTime = timeOfLastActivity + settings.timeout * 1000;
      var delta = getDateNow() - timeOfLastActivity;
      var secondsUntilTimeoutDialog = settings.timeout - settings.countdown;
      var timeout = window.setTimeout(function () {
        setupDialog(signoutTime);
      }, secondsUntilTimeoutDialog * 1000 - delta);
      cleanupFunctions.push(function () {
        window.clearTimeout(timeout);
        if (currentTimer) {
          window.clearTimeout(currentTimer);
        }
      });
    };
    var setupDialog = function setupDialog(signoutTime) {
      var $element = utils.generateDomElementFromString('<div>');
      if (settings.title) {
        var $tmp = utils.generateDomElementFromStringAndAppendText('<h1 id="hmrc-timeout-heading" class="govuk-heading-m push--top">', settings.title);
        $element.appendChild($tmp);
      }
      var $countdownElement = utils.generateDomElementFromString('<span id="hmrc-timeout-countdown" class="hmrc-timeout-dialog__countdown">');
      var $audibleMessage = utils.generateDomElementFromString('<p id="hmrc-timeout-message" class="govuk-visually-hidden screenreader-content" aria-live="assertive">');
      var $visualMessge = utils.generateDomElementFromStringAndAppendText('<p class="govuk-body hmrc-timeout-dialog__message" aria-hidden="true">', settings.message);
      $visualMessge.appendChild(document.createTextNode(' '));
      $visualMessge.appendChild($countdownElement);
      if (settings.messageSuffix) {
        $visualMessge.appendChild(document.createTextNode(" ".concat(settings.messageSuffix)));
      }
      var $staySignedInButton = utils.generateDomElementFromStringAndAppendText('<button id="hmrc-timeout-keep-signin-btn" class="govuk-button">', settings.keepAliveButtonText);
      var $wrapper = document.createElement('div');
      $wrapper.classList.add('govuk-button-group');
      $wrapper.appendChild($staySignedInButton);
      $element.appendChild($visualMessge);
      $element.appendChild($audibleMessage);
      $staySignedInButton.addEventListener('click', keepAliveAndClose);
      $element.appendChild(document.createTextNode(' '));
      if (!settings.hideSignOutButton) {
        var $signOutButton = utils.generateDomElementFromStringAndAppendText('<a id="hmrc-timeout-sign-out-link" class="govuk-link hmrc-timeout-dialog__link">', settings.signOutButtonText);
        $signOutButton.addEventListener('click', signOut);
        $signOutButton.setAttribute('href', settings.signOutUrl);
        $wrapper.appendChild($signOutButton);
      }
      $element.appendChild($wrapper);
      var dialogControl = dialog.displayDialog($element);
      cleanupFunctions.push(function () {
        dialogControl.closeDialog();
      });
      dialogControl.addCloseHandler(keepAliveAndClose);
      dialogControl.setAriaLabelledBy('hmrc-timeout-heading hmrc-timeout-message');
      var getMillisecondsRemaining = function getMillisecondsRemaining() {
        return signoutTime - getDateNow();
      };
      var getSecondsRemaining = function getSecondsRemaining() {
        return Math.round(getMillisecondsRemaining() / 1000);
      };
      var getHumanText = function getHumanText(counter) {
        var minutes;
        var visibleMessage;
        if (counter < 60) {
          visibleMessage = "".concat(counter, " ").concat(settings.properties[counter !== 1 ? 'seconds' : 'second'], ".");
        } else {
          minutes = Math.ceil(counter / 60);
          visibleMessage = "".concat(minutes, " ").concat(settings.properties[minutes === 1 ? 'minute' : 'minutes'], ".");
        }
        return visibleMessage;
      };
      var getAudibleHumanText = function getAudibleHumanText(counter) {
        var humanText = getHumanText(roundSecondsUp(counter));
        var messageParts = [settings.message, ' ', humanText];
        if (settings.messageSuffix) {
          messageParts.push(' ');
          messageParts.push(settings.messageSuffix);
        }
        return messageParts.join('');
      };
      var roundSecondsUp = function roundSecondsUp(counter) {
        if (counter > 60) {
          return counter;
        }
        if (counter < 20) {
          return 20;
        }
        return Math.ceil(counter / 20) * 20;
      };
      var updateTextIfChanged = function updateTextIfChanged($elem, text) {
        if ($elem.innerText !== text) {
          // eslint-disable-next-line no-param-reassign
          $elem.innerText = text;
        }
      };
      var updateCountdown = function updateCountdown(counter) {
        var visibleMessage = getHumanText(counter);
        var audibleHumanText = getAudibleHumanText(counter);
        updateTextIfChanged($countdownElement, visibleMessage);
        updateTextIfChanged($audibleMessage, audibleHumanText);
      };
      var getNextTimeout = function getNextTimeout() {
        var remaining = getMillisecondsRemaining();
        var roundedRemaining = Math.floor(getMillisecondsRemaining() / 1000) * 1000;
        if (roundedRemaining <= 60000) {
          return remaining - roundedRemaining || 1000;
        }
        return remaining - (roundedRemaining - (roundedRemaining % 60000 || 60000));
      };
      var _runUpdate = function runUpdate() {
        var counter = Math.max(getSecondsRemaining(), 0);
        updateCountdown(counter);
        if (counter === 0) {
          timeout();
        } else {
          currentTimer = window.setTimeout(_runUpdate, getNextTimeout());
        }
      };
      _runUpdate();
    };
    var keepAliveAndClose = function keepAliveAndClose() {
      cleanup();
      setupDialogTimer();
      utils.ajaxGet(settings.keepAliveUrl, function () {});
      broadcastSessionActivity();
    };
    var getDateNow = function getDateNow() {
      return Date.now();
    };
    var signOut = function signOut() {
      RedirectHelper.redirectToUrl(settings.signOutUrl);
    };
    var timeout = function timeout() {
      RedirectHelper.redirectToUrl(settings.timeoutUrl);
    };
    var cleanup = function cleanup() {
      while (cleanupFunctions.length > 0) {
        var fn = cleanupFunctions.shift();
        fn();
      }
    };
    return {
      init: init,
      cleanup: cleanup
    };
  }
  TimeoutDialog.dialog = dialog;
  TimeoutDialog.redirectHelper = RedirectHelper;
  TimeoutDialog.utils = utils;

  var SessionActivityService = /*#__PURE__*/function () {
    function SessionActivityService(BrowserBroadcastChannel) {
      _classCallCheck(this, SessionActivityService);
      this.activityChannel = BrowserBroadcastChannel && new BrowserBroadcastChannel('session-activity');
    }
    return _createClass(SessionActivityService, [{
      key: "logActivity",
      value: function logActivity() {
        if (this.activityChannel) {
          var event = {
            timestamp: Date.now()
          };
          this.activityChannel.postMessage(event);
        }
      }
    }, {
      key: "onActivity",
      value: function onActivity(callback) {
        if (this.activityChannel) {
          this.activityChannel.onmessage = function (event) {
            callback(event.data);
          };
        }
      }
    }]);
  }();

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

  exports.TimeoutDialog = TimeoutDialog;
  exports.initAll = initAll;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
