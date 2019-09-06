'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAnalytics = exports.renderAnalytics = undefined;

var _tools = require('./tools.js');

var _snippet = require('./snippet.js');

var template = require('lodash/template');

/**
 * Render analytics as string.
 * Validate options and output logs.
 */
var renderAnalytics = exports.renderAnalytics = function renderAnalytics(options) {
  var cdnUrl = options.cdnUrl,
      services = options.services;
  // validate parameters

  if (services === undefined) throw new Error('please pass "services"-option');
  // DEVELOPMENT
  // in development, stub out all analytics.js methods
  // this prevents "dirtying" your real analytics with local testing/traffic
  var _process$env$NODE_ENV = process.env.NODE_ENV,
      NODE_ENV = _process$env$NODE_ENV === undefined ? 'development' : _process$env$NODE_ENV;

  if (NODE_ENV === 'development') {
    (0, _tools.log)('development mode detected! NOT sending data to analytics-tools');
    return '\n      (function () {\n        // analytics.js stub\n        const analytics = window.analytics = {}\n        const methods = [\n          \'trackSubmit\', \'trackClick\', \'trackLink\', \'trackForm\', \'pageview\',\n          \'identify\', \'reset\', \'group\', \'track\', \'ready\', \'alias\', \'debug\',\n          \'page\', \'once\', \'off\', \'on\'\n        ]\n        methods.forEach(method =>\n          analytics[method] = (...args) => console.log(`[analytics-js-without-segment development-mode active] analytics.${method}`, ...args)\n        )\n      })()\n    ';
  }
  // PRODUCTION
  (0, _tools.log)('production mode! SENDING data to analytics-tools');
  var snippet = (0, _snippet.getSnippet)();
  var theTemplate = template(snippet);

  return theTemplate({
    cdnUrl: cdnUrl || 'https://cdnjs.cloudflare.com/ajax/libs/analytics.js/2.9.1/analytics.min.js', // default
    services: JSON.stringify(services)
  });
};

/**
 * Run analytics and attach them to window.analytics
 */
var runAnalytics = exports.runAnalytics = function runAnalytics(options) {
  eval(renderAnalytics(options));
};