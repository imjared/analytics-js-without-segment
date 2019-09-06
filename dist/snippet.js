"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSnippet = getSnippet;
/**
 * LOAD ANALYTICS.JS with configured `services` FROM `cdnUrl`.
 *
 * DETAILS
 * This file is the pure script that loads analytics.js from the cdnUrl.
 * It contains placeholders for the parameters `services` and `cdnUrl`,
 * which will be replaced when building/rendering this file (using `lodash.template()`).
 *
 * WHAT DOES THIS FILE DO?
 * It creates a queue for stubbed methods,
 *  which are available BEFORE analytics.js has been full loaded.
 * After analytics.js and its services has been fully loaded,
 *  it forwards events within the cue to the services,
 *  so that no events get lost.
 *
 * SOURCE
 * This file originally comes from https://gist.github.com/typpo/5e2e4403c60314e04e8b6b257555f6de.
 * => see the related blogpost at http://www.ianww.com/blog/2017/08/06/analytics-js-standalone-library/
 */
function getSnippet() {
  return "\n    window.analytics || (window.analytics = {});\n\n    // Create a queue to push events and stub all methods\n    window.analytics_queue || (window.analytics_queue = []);\n    (function() {\n      var methods = ['identify', 'track', 'trackLink', 'trackForm', 'trackClick', 'trackSubmit', 'page', 'pageview', 'ab', 'alias', 'ready', 'group', 'on', 'once', 'off'];\n      var factory = function(method) {\n        return function () {\n          var args = Array.prototype.slice.call(arguments);\n          args.unshift(method);\n          analytics_queue.push(args);\n          return window.analytics;\n        };\n      };\n      for (var i = 0; i < methods.length; i++) {\n        var method = methods[i];\n        window.analytics[method] = factory(method);\n      }\n    })();\n\n    // Load analytics.js after everything else\n    analytics.load = function(callback) {\n      var script = document.createElement('script');\n      script.async = true;\n      script.type = 'text/javascript';\n      script.src = '<%= cdnUrl %>';  // NOTE: is replaced when building (via lodash.template())\n      if (script.addEventListener) {\n        script.addEventListener('load', function(e) {\n          if (typeof callback === 'function') {\n            callback(e);\n          }\n        }, false);\n      } else {  // IE8\n        script.onreadystatechange = function () {\n          if (this.readyState == 'complete' || this.readyState == 'loaded') {\n            callback(window.event);\n          }\n        };\n      }\n      var firstScript = document.getElementsByTagName('script')[0];\n      firstScript.parentNode.insertBefore(script, firstScript);\n    };\n\n    analytics.load(function() {\n      analytics.initialize(<%= services %>);  // NOTE: is replaced when building (via lodash.template())\n      // Loop through the interim analytics queue and reapply the calls to their\n      // proper analytics.js method.\n      while (window.analytics_queue.length > 0) {\n        var item = window.analytics_queue.shift();\n        var method = item.shift();\n        if (analytics[method]) analytics[method].apply(analytics, item);\n      }\n    });\n  ";
}