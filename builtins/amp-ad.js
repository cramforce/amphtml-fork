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

import {BaseElement} from '../src/base-element';
import {getAdIframeSrc} from './amp-ad-iframe-prefixes'
import {isLayoutSizeDefined} from '../src/layout';
import {loadPromise} from '../src/event-helper';
import {registerElement} from '../src/custom-element';
import {getIframe} from '../src/3p-frame'


/**
 * @param {!Window} win Destination window for the new element.
 */
export function installAd(win) {
  class AmpAd extends BaseElement {
    /** @override */
    isLayoutSupported(layout) {
      return isLayoutSizeDefined(layout);
    }

    /** @override */
    layoutCallback() {
      if (this.element.getAttribute('iframe-src')) {
        return directIframeLayout();
      }
      return threePFrameLayout();
    }

    threePFrameLayout() {
      var iframe = getIframe(this.element.ownerDocument.defaultView,
            this.element);
      this.applyFillContent(iframe);
      this.element.appendChild(iframe);
      return loadPromise(iframe);
    }

    directIframeLayout() {
      var src = getAdIframeSrc(this.element);
      var iframe = document.createElement('iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.src = src;
      this.applyFillContent(iframe);
      iframe.width = width;
      iframe.height = height;
      this.element.appendChild(iframe);
      return loadPromise(iframe);
    }
  }

  registerElement(win, 'amp-ad', AmpAd);
}
