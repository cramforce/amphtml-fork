/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Utility functions for scripts running inside of a third
 * party iframe.
 */


import {assert} from './asserts';


/** @typedef {function(!Window, !Object)}  */
var ThirdPartyFunction;


/** @const {!Object<!Object<ThirdPartyFunction>>} */
var registrations = {
  ad: {}
};

var syncScriptLoads = 0;

/**
 * @param {string} type The type of 3p integration. See keys in the
 *     registrations objects.
 * @param {string} id The specific 3p integration.
 * @param {ThirdPartyFunction} draw Function that draws the 3p integration.
 */
export function register(type, id, draw) {
  var ofType = assert(registrations[type], 'Unknown type ' + type)
  ofType[id] = draw;
}

/**
 * Execute the 3p integration with the given type and id.
 * @param {string} type
 * @param {id} id
 * @param {!Window} win
 * @param {!Object} data
 */
export function run(type, id, win, data) {
  var fn = assert(registrations[type], 'Unknown type ' + type)[id];
  assert(fn, 'Unknown ' + type + ': ' + id);
  fn(win, data);
}

/**
 * Synchronously load the given script URL. Only use this if you need a sync
 * load. Otherwise just insert a script tag into the page.
 * Supports taking a callback that will be called synchronously after the given
 * script was executed.
 * @param {!Window} win
 * @param {string} url
 * @param {function()=} opt_cb
 */
export function writeScript(win, url, opt_cb) {
  win.document.write('<' + 'script src="' + encodeURI(url) + '"><' + '/script>');
  if (opt_cb) {
    executeAfterWriteScript(win, opt_cb);
  }
}

/**
 * Run the function after all currently waiting sync scripts have been
 * executed.
 * @param {!Window} win
 * @param {function()} fn
 */
function executeAfterWriteScript(win, fn) {
  var index = syncScriptLoads++;
  win['__runScript' + index] = fn;
  win.document.write('<' + 'script>__runScript' + index + '()<' + '/script>')
}

/**
 * Throws if the given src doesn't start with prefix.
 * @param {string} prefix
 * @param {string} src
 */
export function validateSrcPrefix(prefix, src) {
  if (src.indexOf(prefix) != 0) {
    throw new Error('Invalid src ' + src);
  }
}
