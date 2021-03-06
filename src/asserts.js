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
 * Throws an error if the first argument isn't truish.
 *
 * Supports argument substitution into the message via %s placeholders.
 *
 * @param {T} shouldBeTruish The value to assert. The assert fails if it does
 *     not evaluate to true.
 * @param {string} message The assertion message
 * @param {...*} var_args Arguments substituted into %s in the message.
 * @return {T} The value of shouldBeTruish.
 * @template T
 */
export function assert(shouldBeTrueish, message, var_args) {
  if (!shouldBeTrueish) {
    for (var i = 2; i < arguments.length; i++) {
      var val = arguments[i];
      if (val instanceof Element) {
        val = val.outerHTML;
      }
      message = message.replace(/\%s/, val);
    }
    throw new Error('Assertion failed: ' + message);
  }
  return shouldBeTrueish;
};
