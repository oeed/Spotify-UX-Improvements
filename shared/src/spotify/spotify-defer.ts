/**
 * @file
 * Introduces a function called "defer" that allows functions to be
 * executed in the next available tick.
 *
 * Unlike "setTimeout", "defer" executes the function at the nearest
 * possible time without clamping.
 *
 * @see Spotify.defer
 */
'use strict';

var hasWindow = typeof window != 'undefined';
var hasDefineProperty = typeof Object.defineProperty == 'function';

if (hasWindow && (window as any).__modDefFn) {
  // If deferred has been attached to the global scope
  // module.exports = (window as any).__modDefFn;
}
/**
 * Storage for deferred functions to be executed.
 *
 * @type {Array.<function()>}
 * @private
 */
var deferred: any[] = [];


/**
 * A bound version of the postMessage routine used to trigger deferred
 * execution.
 *
 * @type {function()}
 * @private
 */
var send: any;
var origin: any;

function bindSendDom() {
  origin = (window.location.origin ||
    window.location.protocol + '//' + window.location.hostname);
  send = window.postMessage.bind(window, '@execute_deferreds', origin);
  if (!(window as any).__hasDeferredHandler) {
    if (hasDefineProperty) {
      Object.defineProperty(window, '__hasDeferredHandler', {
        value: 1
      });
    } else {
      (window as any).__hasDeferredHandler = 1;
    }
    var handler = function(e: any) {
      if (e.origin != origin && e.data != '@execute_deferreds') {
        return;
      }
      executeDeferreds();
    };
    if (window.addEventListener) {
      window.addEventListener('message', handler);
    } else {
      (window as any).attachEvent('onmessage', handler);
    }
  }
}

function bindSendImmediate() {
  send = setImmediate.bind(null, executeDeferreds);
}

function bindSendTimeout() {
  send = setTimeout.bind(null, executeDeferreds, 10);
}

function bindSendAuto() {
  if (hasWindow && window.postMessage) {
    bindSendDom();
  } else if (typeof setImmediate != 'undefined') {
    bindSendImmediate();
  } else {
    bindSendTimeout();
  }
}

bindSendAuto();

/**
 * Executes the deferred functions when the window
 * receives an 'execute_deferreds' message.
 *
 * @private
 */
function executeDeferreds() {
  var fns = deferred.splice(0);
  if (!fns.length) return;
  for (var i = 0, l = fns.length; i < l; i++) {
    try {
      fns[i]();
    } finally {
      // Do nothing.
      null;
    }
  }
}


/**
 * Executes the function applied at the nearest possible time without
 * clamping.
 *
 * @param {function()} fn The function to execute.
 */
export var defer = function(fn: any) {
  var trigger = !deferred.length;
  deferred.push(fn);
  if (trigger) send();
};

if (hasWindow && !(window as any).__modDefFn) {
  if (hasDefineProperty) {
    Object.defineProperty(window, '__modDefFn', {
      value: defer
    });
  } else {
    (window as any).__modDefFn = defer;
  }
}

/**
 * Export interface for binding send method to a particular implementation,
 * which is intended primarily for use by integration tests where the send method
 * can be explicitly set to immediate/timeout, even if mock DOM globals exist.
 */
(defer as any).use = {
  auto: bindSendAuto,
  dom: bindSendDom,
  immediate: bindSendImmediate,
  timeout: bindSendTimeout,
};